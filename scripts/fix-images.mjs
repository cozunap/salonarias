// Fix image paths in Supabase to match real files in public/assets/

const MANAGEMENT_API = 'https://api.supabase.com';
const PROJECT_REF = 'ijybosldsvisauibmupg';

const sql = `
-- Update slider images with real filenames
UPDATE public.homepage_sliders SET image = '/assets/Brusing-et-Coupe.webp' WHERE sort_order = 1;
UPDATE public.homepage_sliders SET image = '/assets/Defrisage-eye.webp' WHERE sort_order = 2;

-- Update service images
UPDATE public.services SET image = '/assets/Defrisage.webp' WHERE sort_order = 1;
UPDATE public.services SET image = '/assets/Meches-et-Coloration.webp' WHERE sort_order = 2;
UPDATE public.services SET image = '/assets/Traitements.webp' WHERE sort_order = 3;

-- Update gallery images
UPDATE public.gallery SET src = '/assets/Barber-Salon-Beaute.webp' WHERE sort_order = 1;
UPDATE public.gallery SET src = '/assets/Curly-Hair.webp' WHERE sort_order = 2;
UPDATE public.gallery SET src = '/assets/Black-Femme.webp' WHERE sort_order = 3;
UPDATE public.gallery SET src = '/assets/Red-Hair.webp' WHERE sort_order = 4;
`;

async function run() {
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    const res = await fetch(`${MANAGEMENT_API}/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ query: sql })
    });
    const text = await res.text();
    console.log('Status:', res.status);
    console.log(text);
}
run().catch(console.error);
