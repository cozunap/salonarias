import { createClient } from '@supabase/supabase-js';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });
dotenv.config({ path: resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

import fs from 'fs';

const tables = ['homepage_sliders', 'services', 'bookings', 'settings', 'gallery'];

async function migrate() {
  console.log("Starting export...");
  const exportData = {};
  for (const table of tables) {
    console.log(`Fetching from Supabase: ${table}`);
    const { data, error } = await supabase.from(table).select('*');
    if (error) {
      console.log(`[Supabase] Error fetching ${table}:`, error.message);
      continue;
    }
    
    if (!data || data.length === 0) {
      console.log(`[Supabase] Table ${table} is empty.`);
      continue;
    }
    exportData[table] = data;
    console.log(`Exported ${data.length} rows for ${table}`);
  }
  
  fs.writeFileSync(resolve(__dirname, '../supabase_export.json'), JSON.stringify(exportData, null, 2));
  console.log("Export complete! Data saved to supabase_export.json");
  process.exit(0);
}

migrate();
