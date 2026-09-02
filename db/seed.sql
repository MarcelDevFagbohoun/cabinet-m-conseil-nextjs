-- Jeu de données de démonstration (facultatif).
-- À exécuter APRÈS schema.sql et après la création d'un compte admin.

INSERT INTO `properties`
 (slug, title, type, transaction, status, price, area_sqm, city, district,
  bedrooms, bathrooms, excerpt, description, cover_image, is_published, is_featured, amenities)
VALUES
 ('parcelle-500m2-abomey-calavi-golfe',
  'Parcelle de 500 m², Abomey-Calavi, Golfe',
  'parcelle','vente','disponible', 12500000, 500, 'Abomey-Calavi','Golfe',
  NULL, NULL,
  'Parcelle viabilisée de 500 m², titre foncier disponible, accès bitumé à 200 m.',
  'Parcelle plate et entièrement dégagée, située dans une zone résidentielle en pleine expansion. Le titre foncier est disponible et vérifié par notre cabinet. Bornage effectué, aucun litige en cours.',
  '/uploads/demo-parcelle.jpg', 1, 1, JSON_ARRAY('Titre foncier','Bornée','Eau et électricité à proximité')),
 ('maison-4-chambres-cotonou-fidjrosse',
  'Maison 4 chambres avec cour, Cotonou, Fidjrossè',
  'maison','vente','disponible', 65000000, 320, 'Cotonou','Fidjrossè',
  4, 3,
  'Villa basse de 4 chambres sur parcelle de 320 m², garage et cour intérieure.',
  'Villa récente en très bon état, comprenant un salon spacieux, une cuisine équipée, quatre chambres dont une suite parentale, trois salles d''eau, une buanderie et un garage couvert. Documents complets et vérifiés.',
  '/uploads/demo-maison.jpg', 1, 1, JSON_ARRAY('Garage','Forage','Groupe électrogène','Clôturée'));
