import { queryOne } from "./db";
import type { PropertyInput } from "./validation";

/** Génère un slug unique pour la table `properties`. */
export async function uniquePropertySlug(base: string, excludeId?: number) {
  let slug = base || "bien";
  let suffix = 1;
  while (suffix < 50) {
    const existing = await queryOne<{ id: number }>(
      "SELECT id FROM properties WHERE slug = ? LIMIT 1",
      [slug]
    );
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${++suffix}`;
  }
  return `${base}-${Date.now()}`;
}

export async function uniquePostSlug(base: string, excludeId?: number) {
  let slug = base || "article";
  let suffix = 1;
  while (suffix < 50) {
    const existing = await queryOne<{ id: number }>("SELECT id FROM posts WHERE slug = ? LIMIT 1", [
      slug,
    ]);
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${++suffix}`;
  }
  return `${base}-${Date.now()}`;
}

/** Insère galerie + documents d'un bien (dans une transaction ouverte). */
export async function insertPropertyChildren(
  conn: { execute: (sql: string, params: any[]) => Promise<any> },
  propertyId: number,
  data: PropertyInput
) {
  for (const [index, image] of (data.images ?? []).entries()) {
    if (!image.url) continue;
    await conn.execute(
      "INSERT INTO property_images (property_id, url, alt, position) VALUES (?,?,?,?)",
      [propertyId, image.url, image.alt ?? null, index]
    );
  }
  for (const doc of data.documents ?? []) {
    if (!doc.url) continue;
    await conn.execute(
      "INSERT INTO property_documents (property_id, label, doc_type, url, is_public) VALUES (?,?,?,?,?)",
      [propertyId, doc.label, doc.doc_type, doc.url, doc.is_public ? 1 : 0]
    );
  }
}

export const PROPERTY_COLUMNS = [
  "slug",
  "title",
  "type",
  "transaction",
  "status",
  "price",
  "price_unit",
  "price_on_request",
  "area_sqm",
  "city",
  "district",
  "address",
  "bedrooms",
  "bathrooms",
  "floors",
  "year_built",
  "amenities",
  "excerpt",
  "description",
  "legal_notes",
  "cover_image",
  "is_published",
  "is_featured",
  "meta_title",
  "meta_description",
] as const;

export function propertyValues(data: PropertyInput, slug: string) {
  return [
    slug,
    data.title,
    data.type,
    data.transaction,
    data.status,
    data.price,
    data.price_unit,
    data.price_on_request ? 1 : 0,
    data.area_sqm,
    data.city,
    data.district,
    data.address,
    data.bedrooms,
    data.bathrooms,
    data.floors,
    data.year_built,
    JSON.stringify(data.amenities ?? []),
    data.excerpt,
    data.description ?? "",
    data.legal_notes,
    data.cover_image,
    data.is_published ? 1 : 0,
    data.is_featured ? 1 : 0,
    data.meta_title,
    data.meta_description,
  ];
}
