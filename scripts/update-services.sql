-- Borrar los servicios existentes
DELETE FROM services;

-- Insertar los nuevos servicios
INSERT INTO services (name, image, items, active, sort_order) VALUES
('BRUSING ET COUPE', '/assets/Brusing-et-Coupe.webp', ARRAY['Coupe Ajustement', 'Brushing Cheveux Courts', 'Coupe Femme', 'Brushing Cheveux Mi-Longs', 'Brushing Cheveux Longs', 'Coupe+Brushing Cheveux Court', 'Brushing Cheveux Très Longs', 'Coupe + Brushing Cheveux Mi-Long', 'Coupe + Brushing Cheveux Long'], true, 1),

('DÉFRISAGE', '/assets/Defrisage.webp', ARRAY['Défrisant Protective', 'Défrisant Affirm', 'Défrisant Olive Oil', 'Défrisant Motions', 'Défrisant Mizani'], true, 2),

('MÈCHES ET COLORATION', '/assets/Meches-et-Coloration.webp', ARRAY['Coloration Tête Complète', 'Mèches Dessus Tête', 'Coloration Racine', 'Coloration Extra', 'Coloration Mousse', 'Mèches Par Papier', 'Mèches Demi Tête', 'Mèches Tête Complète'], true, 3),

('TRAITEMENTS', '/assets/Traitements.webp', ARRAY['Olaplex + Brushing', 'Traitement Keratine Long', 'Traitement Keratine Court', 'Traitement Kerastraight Moisture', 'Traitement Kerastraight Proteine', 'Traitement Moroccanoil'], true, 4),

('SERVICE POUR HOMMES', '/assets/Barber-Salon-Beaute.webp', ARRAY['Tressage', 'Defrisage', 'Coupe', 'Coloration', 'Barbe'], true, 5),

('AUTRES SERVICES', '/assets/Coupe-de-cheveux.webp', ARRAY['Défaire', 'Tissage', 'Extension Rangée (Colle)', 'Greffes Tissage', 'Extensions de Cheveux', 'Décoloration Cheveux Courts', 'Coupe Enfant', 'Shampooing Toner', 'Coiffure Cheveux Courts', 'Coiffure Cheveux Mi-Longs', 'Coiffure Cheveux Longs', 'Permanente Bouclée', 'Forfait Mariage'], true, 6);
