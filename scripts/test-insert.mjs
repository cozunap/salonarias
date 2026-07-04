import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('services').insert([{
        name: "Test",
        image: "/assets/test.webp",
        items: ["Test Item"],
        active: false,
        sort_order: 99
    }]).select();
    if (error) {
        console.error('Error inserting service:', error);
    } else {
        console.log('Inserted:', JSON.stringify(data, null, 2));
        // Test delete
        if (data && data.length > 0) {
            const id = data[0].id;
            const { error: delError } = await supabase.from('services').delete().eq('id', id);
            console.log('Deleted test record error:', delError);
        }
    }
}

check();
