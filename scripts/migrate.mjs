// Migration script — native fetch (Node 18+)

const MANAGEMENT_API = 'https://api.supabase.com';
const PROJECT_REF = 'rzdfpxecsszuilftkkxx';

const sql = `
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.homepage_sliders CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;

CREATE TABLE public.homepage_sliders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    image TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT,
    button_text TEXT,
    button_link TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.services (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    name TEXT NOT NULL,
    image TEXT,
    items TEXT[],
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.gallery (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    src TEXT NOT NULL,
    alt TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.bookings (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    service_id BIGINT REFERENCES public.services(id) ON DELETE SET NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME WITHOUT TIME ZONE NOT NULL,
    status TEXT DEFAULT 'pending',
    notes TEXT
);

ALTER TABLE public.homepage_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_sliders ON public.homepage_sliders FOR SELECT USING (active = true);
CREATE POLICY select_services ON public.services FOR SELECT USING (active = true);
CREATE POLICY select_gallery ON public.gallery FOR SELECT USING (active = true);
CREATE POLICY insert_bookings ON public.bookings FOR INSERT WITH CHECK (true);

INSERT INTO public.homepage_sliders (image, title, subtitle, button_text, button_link, sort_order) VALUES
('/assets/slider-1.webp', 'BIENVENUE AU SALON ARIAS', 'EXPERTES EN CHEVEUX BOUCLES ET CREPUS', 'RESERVER', '/services', 1),
('/assets/slider-2.webp', 'LISSAGE PROFESSIONNEL', 'VIVEZ L EXPERIENCE DU LISSAGE DOMINICAIN', 'NOS SERVICES', '/services', 2);

INSERT INTO public.services (name, image, items, sort_order) VALUES
('Lissage et Keratine', '/assets/Defrisage.webp', ARRAY['Lissage Dominicain', 'Soin Keratine', 'Botox Capillaire', 'Defrisage'], 1),
('Coloration et Reflets', '/assets/Coloration.webp', ARRAY['Coloration Complete', 'Balayage', 'Meches', 'Gloss'], 2),
('Coupe et Style', '/assets/Coupe.webp', ARRAY['Coupe Femme', 'Mise en plis', 'Brushing', 'Coiffure de soiree'], 3);

INSERT INTO public.gallery (src, alt, sort_order) VALUES
('/assets/gallery-1.webp', 'Salon Interior', 1),
('/assets/gallery-2.webp', 'Hair Styling', 2),
('/assets/gallery-3.webp', 'Expert Team', 3),
('/assets/gallery-4.webp', 'Happy Client', 4);
`;

async function run() {
    const token = process.env.SUPABASE_ACCESS_TOKEN;
    if (!token) {
        console.error('ERROR: Set SUPABASE_ACCESS_TOKEN env var first.');
        process.exit(1);
    }

    const res = await fetch(`${MANAGEMENT_API}/v1/projects/${PROJECT_REF}/database/query`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: sql })
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', text);
    if (!res.ok) process.exit(1);
    console.log('Migration complete!');
}

run().catch(console.error);
