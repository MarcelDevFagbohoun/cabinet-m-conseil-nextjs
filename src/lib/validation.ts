import { z } from "zod";

const optionalString = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v));

const optionalNumber = z
  .union([z.number(), z.string()])
  .optional()
  .transform((v) => {
    if (v === undefined || v === null || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide").max(190),
  password: z.string().min(8, "Mot de passe trop court").max(200),
});

export const propertySchema = z.object({
  title: z.string().trim().min(4, "Titre trop court").max(190),
  slug: optionalString(190),
  type: z.enum(["parcelle", "maison", "appartement", "immeuble", "bureau", "autre"]),
  transaction: z.enum(["vente", "location"]),
  status: z.enum(["disponible", "reserve", "vendu", "loue"]),
  price: optionalNumber,
  price_unit: z.string().trim().max(30).default("FCFA"),
  price_on_request: z.coerce.boolean().default(false),
  area_sqm: optionalNumber,
  city: optionalString(120),
  district: optionalString(120),
  address: optionalString(255),
  bedrooms: optionalNumber,
  bathrooms: optionalNumber,
  floors: optionalNumber,
  year_built: optionalNumber,
  amenities: z.array(z.string().trim().max(80)).max(30).default([]),
  excerpt: optionalString(320),
  description: z.string().trim().max(20000).optional().default(""),
  legal_notes: optionalString(4000),
  cover_image: optionalString(255),
  is_published: z.coerce.boolean().default(false),
  is_featured: z.coerce.boolean().default(false),
  meta_title: optionalString(190),
  meta_description: optionalString(320),
  images: z
    .array(
      z.object({
        url: z.string().trim().max(255),
        alt: optionalString(190),
      })
    )
    .max(30)
    .default([]),
  documents: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(190),
        doc_type: z.enum(["titre_foncier", "plan", "convention", "attestation", "autre"]),
        url: z.string().trim().max(255),
        is_public: z.coerce.boolean().default(false),
      })
    )
    .max(30)
    .default([]),
});

export const postSchema = z.object({
  title: z.string().trim().min(4, "Titre trop court").max(190),
  slug: optionalString(190),
  category: z.string().trim().min(2).max(80).default("Juridique"),
  excerpt: optionalString(320),
  content: z.string().trim().min(20, "Contenu trop court").max(60000),
  cover_image: optionalString(255),
  is_published: z.coerce.boolean().default(false),
  meta_title: optionalString(190),
  meta_description: optionalString(320),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nom requis").max(120),
  email: z.string().trim().toLowerCase().email("Email invalide").max(190),
  phone: optionalString(40),
  subject: optionalString(190),
  message: z.string().trim().min(10, "Message trop court").max(4000),
  property_id: optionalNumber,
  // Champ piège anti-robot : doit rester vide.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PropertyInput = z.infer<typeof propertySchema>;
export type PostInput = z.infer<typeof postSchema>;
