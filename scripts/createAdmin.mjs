import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdmin() {
    console.log("Attempting to create admin user...");
    const { data, error } = await supabase.auth.signUp({
        email: 'salonarias22@gmail.com',
        password: '1d5i6qt6WCJ',
    });

    if (error) {
        console.error("Error creating user:", error);
        process.exit(1);
    }

    console.log("User created successfully!");
    console.log("Data:", JSON.stringify(data, null, 2));

    if (data?.user?.identities?.length === 0) {
        console.log("Note: This email might already be registered.");
    }
}

createAdmin();
