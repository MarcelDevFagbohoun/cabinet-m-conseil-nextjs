<<<<<<< HEAD
# Cabinet M Conseils — site + espace d'administration

Site vitrine et catalogue immobilier du **Cabinet M Conseils** (Cotonou, Bénin).

- **Next.js 14** (App Router, React Server Components) — rendu serveur pour un SEO optimal
- **MySQL 8** via `mysql2` — requêtes préparées uniquement
- **Tailwind CSS** — design repris de la charte du cabinet (crème + orange)
- **Espace admin** protégé (JWT httpOnly + bcrypt) pour gérer biens, blog et messages

## Pages publiques

| URL | Contenu |
| --- | --- |
| `/` | Accueil : hero, expertises, biens à la une, contact |
| `/services` | Les 5 services avec sélecteur et lien WhatsApp pré-rempli |
| `/biens-immobiliers` | Liste filtrable (type, transaction, ville, recherche) |
| `/biens-immobiliers/[slug]` | Fiche complète : galerie, caractéristiques, documents, note juridique, formulaire |
| `/blog` et `/blog/[slug]` | Articles publiés depuis l'admin |
| `/a-propos` | Présentation du cabinet |
| `/contact` | Coordonnées + formulaire (anti-spam) |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement |

## Espace administrateur

`/admin/login` puis :

- **/admin** — tableau de bord (compteurs)
- **/admin/biens** — liste, création, modification, suppression
  - photos multiples (téléversement), photo principale, textes alternatifs
  - documents (titre foncier, plan, convention…) publics ou internes
  - champs maison : chambres, salles d'eau, niveaux, année, équipements
  - champs SEO : slug, titre et description
- **/admin/blog** — rédaction et publication d'articles
- **/admin/messages** — messages reçus via le formulaire

## Installation

```bash
# 1. Dépendances
npm install

# 2. Configuration
cp .env.example .env
#   → renseigner DB_* et générer AUTH_SECRET :
#     openssl rand -hex 32

# 3. Base de données (crée la base et les tables)
npm run db:init

# 4. Compte administrateur
npm run admin:create -- admin@cabinetmconseils.com "MotDePasseTresFort!2026" "Administrateur"

# 5. Démarrage
npm run dev      # http://localhost:3000
```

Mise en production :

```bash
npm run build
npm run start    # port 3000 (à placer derrière Nginx + HTTPS)
```

## Sécurité mise en place

- Mots de passe hachés **bcrypt** (coût 12), jamais stockés en clair
- Session **JWT signée HS256** dans un cookie `httpOnly`, `SameSite=Lax`, `Secure` en production, expiration 8 h
- Middleware de protection sur `/admin/**` et `/api/admin/**`
- Verrouillage du compte après 5 tentatives échouées (15 minutes)
- Limitation de débit sur la connexion et le formulaire de contact
- **Requêtes préparées partout** + `multipleStatements: false` (anti-injection SQL)
- Validation stricte des entrées avec **Zod** (client et serveur)
- Téléversements : types autorisés JPG/PNG/WEBP/PDF uniquement, 8 Mo max, nom de fichier régénéré côté serveur
- En-têtes de sécurité HTTP (`X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- IP des messages stockée hachée (SHA-256), jamais en clair
- `/admin` et `/api` exclus de l'indexation

## SEO

- Métadonnées uniques par page (`title`, `description`, canonical, Open Graph, Twitter Card)
- Données structurées JSON-LD : `LegalService`, `RealEstateListing`, `BlogPosting`, `ItemList`
- `sitemap.xml` dynamique (pages + biens + articles) et `robots.txt`
- Rendu serveur, images `next/image` optimisées, polices `next/font` sans requête externe bloquante

## Arborescence

```
db/                  schema.sql, seed.sql
scripts/             init-db.mjs, create-admin.mjs
src/app/(site)/      pages publiques
src/app/admin/       espace d'administration
src/app/api/         routes API (admin + contact)
src/components/      composants UI
src/lib/             db, auth, validation, requêtes, utilitaires
public/uploads/      fichiers téléversés (à sauvegarder)
```

## Hébergement conseillé

VPS ou hébergement Node.js (Node 18.17+) avec MySQL 8 :
`npm run build` puis `npm run start` derrière Nginx (HTTPS obligatoire pour le cookie `Secure`).
Le dossier `public/uploads` doit être persistant et inclus dans les sauvegardes.
=======
# cabinet-m-conseil-nextjs
>>>>>>> 38095222afcb1bc6c1f135ee4126eff798ca6f5e
