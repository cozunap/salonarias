import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const DATA = [
    {
        name: "BRUSING ET COUPE",
        image: "/assets/Brusing-et-Coupe.webp",
        items: [
            "Coupe Ajustement",
            "Brushing Cheveux Courts",
            "Coupe Femme",
            "Brushing Cheveux Mi-Longs",
            "Brushing Cheveux Longs",
            "Coupe+Brushing Cheveux Court",
            "Brushing Cheveux Très Longs",
            "Coupe + Brushing Cheveux Mi-Long",
            "Coupe + Brushing Cheveux Long"
        ],
        sort_order: 1
    },
    {
        name: "DÉFRISAGE",
        image: "/assets/Defrisage-eye.webp",
        items: [
            "Défrisant Protective",
            "Défrisant Affirm",
            "Défrisant Olive Oil",
            "Défrisant Motions",
            "Défrisant Mizani"
        ],
        sort_order: 2
    },
    {
        name: "MÈCHES ET COLORATION",
        image: "/assets/Meches-et-Coloration.webp",
        items: [
            "Coloration Tête Complète",
            "Mèches Dessus Tête",
            "Coloration Racine",
            "Coloration Extra",
            "Coloration Mousse",
            "Mèches Par Papier",
            "Mèches Demi Tête",
            "Mèches Tête Complète"
        ],
        sort_order: 3
    },
    {
        name: "TRAITEMENTS",
        image: "/assets/Traitements.webp",
        items: [
            "Olaplex + Brusing",
            "Traitement Keratine Long",
            "Traitement Keratine Court",
            "Traitement Kerastraight Moisture",
            "Traitement Kerastraight Proteine",
            "Traitement Moroccanoil"
        ],
        sort_order: 4
    },
    {
        name: "SERVICE POUR HOMMES",
        image: "/assets/Barber-Salon-Beaute.webp",
        items: [
            "Tressage",
            "Defrisage",
            "Coupe",
            "Coloration",
            "Barbe"
        ],
        sort_order: 5
    },
    {
        name: "AUTRES SERVICES",
        image: "/assets/Shampooing-1.webp",
        items: [
            "Défaire Tissage",
            "Extension Rangée (Colle)",
            "Greffes Tissage",
            "Extensions de Cheveux",
            "Décoloration Cheveux Courts",
            "Coupe Enfant",
            "Shampooing",
            "Toner",
            "Coiffure Cheveux Courts",
            "Coiffure Cheveux Mi-Longs",
            "Coiffure Cheveux Longs",
            "Permanente Bouclée",
            "Forfait Mariage"
        ],
        sort_order: 6
    }
];

async function seed() {
    console.log("Logging in as admin...");
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: 'salonarias22@gmail.com',
        password: '1d5i6qt6WCJ'
    });
    
    if(authErr) {
        console.error("Auth error:", authErr.message);
        return;
    }

    console.log("Emptying current services...");
    const { error: delErr } = await supabase.from('services').delete().neq('id', 0);
    if (delErr) {
        console.error("Error deleting old services:", delErr);
    }
    
    console.log("Inserting actual services...");
    const { error: insErr } = await supabase.from('services').insert(DATA.map(d => ({ ...d, active: true })));
    
    if (insErr) {
        console.error("Error inserting services:", insErr);
    } else {
        console.log("Successfully seeded services!");
    }
}

seed();
