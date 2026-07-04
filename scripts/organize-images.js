// scripts/organize-images.js
// ---------------------------------------------------------------
// Move all project images into a website‑specific folder and
// rewrite JSON references.
//
// Usage (example):
//   WEBSITE_NAME=salonarias node scripts/organize-images.js
//
// Required env vars:
//   WEBSITE_NAME   – name of the website (folder) to create.
//   JSON_PATH      – optional path to the JSON file that stores
//                    image references (default: data/services.json).
// ---------------------------------------------------------------

const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

(async () => {
  const website = process.env.WEBSITE_NAME?.trim();
  if (!website) {
    console.error('❌ Set WEBSITE_NAME env var (e.g. WEBSITE_NAME=salonarias)');
    process.exit(1);
  }

  const jsonPath = process.env.JSON_PATH || path.resolve(__dirname, '..', 'data', 'services.json');

  // 1️⃣ Define source globs (only the public/out asset folders)
  const imageGlob = '{public,out}/assets/**/*.{jpg,jpeg,png,webp,svg,gif}';
  const matches = glob.sync(imageGlob, { cwd: path.resolve(__dirname, '..'), nodir: true });
  console.log(`🔎 Found ${matches.length} image(s) to reorganise.`);

  // 2️⃣ Destination base folder (e.g. public/assets/<website>)
  const destBase = path.resolve(__dirname, '..', 'public', 'assets', website);
  await fs.mkdir(destBase, { recursive: true });

  // 3️⃣ Move each image
  for (const relPath of matches) {
    const src = path.resolve(__dirname, '..', relPath);
    const fileName = path.basename(relPath);
    const dest = path.join(destBase, fileName);
    try {
      await fs.rename(src, dest);
      console.log(`✅ Moved ${relPath} → public/assets/${website}/${fileName}`);
    } catch (err) {
      console.warn(`⚠️ Could not move ${relPath}: ${err.message}`);
    }
  }

  // 4️⃣ Update JSON references (naïve string replace)
  let db = {};
  try {
    const raw = await fs.readFile(jsonPath, 'utf8');
    db = JSON.parse(raw);
  } catch (_) {
    console.warn('⚠️ JSON file not found – skipping reference update.');
    process.exit(0);
  }

  const oldPrefixRegex = /(public|out)\/assets\//g;
  const newPrefix = `public/assets/${website}/`;
  const updated = JSON.stringify(db).replace(oldPrefixRegex, newPrefix);
  await fs.writeFile(jsonPath, JSON.stringify(JSON.parse(updated), null, 2));
  console.log(`💾 Updated references in ${jsonPath}`);
  console.log('🎉 Image organisation complete!');
})();
