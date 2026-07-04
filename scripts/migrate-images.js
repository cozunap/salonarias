// migrate-images.js
// Node.js script to migrate local images to Cloudflare Images and update references in a JSON database file.
//
// Requirements:
//   - Node.js >= 18 (for native fetch) or install node-fetch if using older version.
//   - npm packages: form-data, glob, fs/promises
//   - Set environment variables: CF_ACCOUNT_ID, CF_API_TOKEN, WEBSITE_NAME, PROJECT_SLUG, DATABASE_PATH
//
// Usage:
//   CLOUDflare credentials are read from environment variables.
//   Adjust CONFIG constant if you prefer a config file.
//   Run: node scripts/migrate-images.js
//
// The script will:
//   1. Scan the project for image files (jpg, jpeg, png, webp, svg, gif).
//   2. For each image, upload it to Cloudflare Images API with a custom ID
//      `${WEBSITE_NAME}/${PROJECT_SLUG}/${relativePath}` so images are organized in folders.
//   3. Replace local image paths in the specified JSON database file with the new CDN URL:
//      `https://imagedelivery.net/${DELIVERY_HASH}/${customId}`.
//   4. Write the updated JSON back to the same file (or a new one if you prefer).

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const FormData = require('form-data');
const fetch = require('node-fetch'); // for Node < 18, ensure installed

// ---------- Configuration ----------
const CONFIG = {
  // Cloudflare credentials (set via environment variables for security)
  accountId: process.env.CF_ACCOUNT_ID, // e.g., "d6476a4bb16ef0034842b9b7a79d5730"
  apiToken: process.env.CF_API_TOKEN, // e.g., "cfut_..."
  deliveryHash: process.env.CF_DELIVERY_HASH, // e.g., "eJfkbxcvXp804aif1wioXw"

  // Organisational identifiers
  websiteName: process.env.WEBSITE_NAME, // e.g., "salonarias"
  projectSlug: process.env.PROJECT_SLUG, // e.g., "beauty"

  // Path to the JSON file that contains image references (adjust as needed)
  // If the file does not exist, we will create an empty one.
  databasePath: process.env.DATABASE_PATH || path.resolve(__dirname, '..', 'data', 'services.json'),

  // Glob pattern to locate image files in the project (only public/out assets)
  imageGlob: '{public,out}/**/*.{jpg,jpeg,png,webp,svg,gif}',

  // Base directory where images live (relative to project root)
  imagesRoot: path.resolve(__dirname, '..'),
};
// -----------------------------------

if (!CONFIG.accountId || !CONFIG.apiToken || !CONFIG.deliveryHash || !CONFIG.websiteName) {
  console.error('❌ Missing required Cloudflare configuration. Set CF_ACCOUNT_ID, CF_API_TOKEN, CF_DELIVERY_HASH, and WEBSITE_NAME environment variables.');
  process.exit(1);
}

// Helper to build the custom ID for Cloudflare Images
function buildCustomId(relativePath) {
  // Replace backslashes with forward slashes for URL safety
  const cleanPath = relativePath.replace(/\\/g, '/');
  return `${CONFIG.websiteName}/${CONFIG.projectSlug}/${cleanPath}`;
}

// Upload a single image file to Cloudflare Images
async function uploadImage(filePath, customId) {
  const fileStream = await fs.readFile(filePath);
  const form = new FormData();
  form.append('file', fileStream, { filename: path.basename(filePath) });
  form.append('id', customId);

  const url = `https://api.cloudflare.com/client/v4/accounts/${CONFIG.accountId}/images/v1`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.apiToken}`,
    },
    body: form,
  });

  const result = await response.json();
  if (!result.success) {
    console.error(`❌ Upload failed for ${filePath}:`, result.errors);
    throw new Error('Upload failed');
  }
  return result.result?.variants?.[0] || null; // Cloudflare returns variant URLs
}

// Main migration function
async function migrate() {
  console.log('🔎 Scanning for image files...');
  const matches = glob.sync(CONFIG.imageGlob, { cwd: CONFIG.imagesRoot, nodir: true });
  console.log(`📁 Found ${matches.length} image(s).`);

  // Load the JSON database (if it exists) or create a new one
  let db = {};
  try {
    // Ensure the directory for the DB exists
    await fs.mkdir(path.dirname(CONFIG.databasePath), { recursive: true });
    const raw = await fs.readFile(CONFIG.databasePath, 'utf8');
    db = JSON.parse(raw);
    console.log(`📖 Loaded database from ${CONFIG.databasePath}`);
  } catch (e) {
    console.warn('⚠️ Database file not found or unreadable, initializing empty JSON.');
    // Write an empty JSON file for future runs
    await fs.writeFile(CONFIG.databasePath, JSON.stringify(db, null, 2), 'utf8');
  }

  // Walk each image, upload, and replace paths in DB
  for (const relPath of matches) {
    const absolutePath = path.join(CONFIG.imagesRoot, relPath);
    const customId = buildCustomId(relPath);
    console.log(`⬆️ Uploading ${relPath} as ${customId}`);
    try {
      const variantUrl = await uploadImage(absolutePath, customId);
      const cdnUrl = `https://imagedelivery.net/${CONFIG.deliveryHash}/${customId}`;
      console.log(`✅ Uploaded. CDN URL: ${cdnUrl}`);

      // Replace occurrences in the JSON DB (naïve string replace)
      const jsonString = JSON.stringify(db);
      const updatedJsonString = jsonString.replace(new RegExp(relPath.replace(/\\/g, '\\\\'), 'g'), cdnUrl);
      db = JSON.parse(updatedJsonString);
    } catch (err) {
      console.error(`⚠️ Skipping ${relPath} due to error.`);
    }
  }

  // Write back the updated DB
  await fs.writeFile(CONFIG.databasePath, JSON.stringify(db, null, 2), 'utf8');
  console.log(`💾 Database updated at ${CONFIG.databasePath}`);
}

migrate()
  .then(() => console.log('🎉 Migration complete!'))
  .catch(err => {
    console.error('❗ Migration failed:', err);
    process.exit(1);
  });
