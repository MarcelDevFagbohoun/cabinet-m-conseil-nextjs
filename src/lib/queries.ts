import { query, queryOne } from "./db";
import type { Post, PropertyFull, Property, PropertyDocument, PropertyImage } from "./types";

function parseAmenities<T extends { amenities: any }>(row: T): T {
  if (typeof row.amenities === "string") {
    try {
      row.amenities = JSON.parse(row.amenities);
    } catch {
      row.amenities = [];
    }
  }
  return row;
}

/* ------------------------------ Biens ------------------------------ */

export type PropertyFilters = {
  type?: string;
  transaction?: string;
  city?: string;
  status?: string;
  q?: string;
  includeUnpublished?: boolean;
  limit?: number;
  offset?: number;
};

export async function listProperties(filters: PropertyFilters = {}) {
  const where: string[] = [];
  const params: any[] = [];

  if (!filters.includeUnpublished) where.push("is_published = 1");
  if (filters.type) {
    where.push("type = ?");
    params.push(filters.type);
  }
  if (filters.transaction) {
    where.push("`transaction` = ?");
    params.push(filters.transaction);
  }
  if (filters.status) {
    where.push("status = ?");
    params.push(filters.status);
  }
  if (filters.city) {
    where.push("city = ?");
    params.push(filters.city);
  }
  if (filters.q) {
    where.push("(title LIKE ? OR excerpt LIKE ? OR city LIKE ? OR district LIKE ?)");
    const like = `%${filters.q}%`;
    params.push(like, like, like, like);
  }

  const limit = Math.min(Math.max(filters.limit ?? 24, 1), 60);
  const offset = Math.max(filters.offset ?? 0, 0);

  const rows = await query<Property>(
    `SELECT * FROM properties
     ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
     ORDER BY is_featured DESC, created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );
  return rows.map(parseAmenities);
}

export async function countProperties(filters: PropertyFilters = {}) {
  const row = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM properties ${filters.includeUnpublished ? "" : "WHERE is_published = 1"}`
  );
  return row?.total ?? 0;
}

export async function listPropertyCities() {
  const rows = await query<{ city: string }>(
    "SELECT DISTINCT city FROM properties WHERE is_published = 1 AND city IS NOT NULL ORDER BY city"
  );
  return rows.map((r) => r.city);
}

export async function getPropertyBySlug(slug: string, includeUnpublished = false) {
  const property = await queryOne<Property>(
    `SELECT * FROM properties WHERE slug = ? ${includeUnpublished ? "" : "AND is_published = 1"} LIMIT 1`,
    [slug]
  );
  if (!property) return null;
  return hydrateProperty(parseAmenities(property), includeUnpublished);
}

export async function getPropertyById(id: number) {
  const property = await queryOne<Property>("SELECT * FROM properties WHERE id = ? LIMIT 1", [id]);
  if (!property) return null;
  return hydrateProperty(parseAmenities(property), true);
}

async function hydrateProperty(property: Property, includePrivateDocs: boolean): Promise<PropertyFull> {
  const [images, documents] = await Promise.all([
    query<PropertyImage>(
      "SELECT * FROM property_images WHERE property_id = ? ORDER BY position ASC, id ASC",
      [property.id]
    ),
    query<PropertyDocument>(
      `SELECT * FROM property_documents WHERE property_id = ? ${
        includePrivateDocs ? "" : "AND is_public = 1"
      } ORDER BY id ASC`,
      [property.id]
    ),
  ]);
  return { ...property, images, documents };
}

export async function listAllPropertySlugs() {
  return query<{ slug: string; updated_at: string }>(
    "SELECT slug, updated_at FROM properties WHERE is_published = 1"
  );
}

/* ------------------------------ Blog ------------------------------ */

export async function listPosts(options: { includeUnpublished?: boolean; limit?: number } = {}) {
  const limit = Math.min(Math.max(options.limit ?? 30, 1), 60);
  return query<Post>(
    `SELECT id, slug, title, category, excerpt, cover_image, is_published, published_at, created_at, updated_at, '' AS content, meta_title, meta_description
     FROM posts
     ${options.includeUnpublished ? "" : "WHERE is_published = 1"}
     ORDER BY COALESCE(published_at, created_at) DESC
     LIMIT ${limit}`
  );
}

export async function getPostBySlug(slug: string, includeUnpublished = false) {
  return queryOne<Post>(
    `SELECT * FROM posts WHERE slug = ? ${includeUnpublished ? "" : "AND is_published = 1"} LIMIT 1`,
    [slug]
  );
}

export async function getPostById(id: number) {
  return queryOne<Post>("SELECT * FROM posts WHERE id = ? LIMIT 1", [id]);
}

export async function listAllPostSlugs() {
  return query<{ slug: string; updated_at: string }>(
    "SELECT slug, updated_at FROM posts WHERE is_published = 1"
  );
}

/* --------------------------- Statistiques -------------------------- */

export async function getAdminStats() {
  const [properties, published, posts, messages] = await Promise.all([
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM properties"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM properties WHERE is_published = 1"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM posts"),
    queryOne<{ n: number }>("SELECT COUNT(*) AS n FROM contact_messages WHERE is_read = 0"),
  ]);
  return {
    properties: properties?.n ?? 0,
    publishedProperties: published?.n ?? 0,
    posts: posts?.n ?? 0,
    unreadMessages: messages?.n ?? 0,
  };
}
