import type { MetadataRoute } from "next";
import { listAllPostSlugs, listAllPropertySlugs } from "@/lib/queries";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/biens-immobiliers`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/a-propos`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${site.url}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];

  try {
    const [properties, posts] = await Promise.all([listAllPropertySlugs(), listAllPostSlugs()]);
    return [
      ...staticRoutes,
      ...properties.map((p) => ({
        url: `${site.url}/biens-immobiliers/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
      ...posts.map((p) => ({
        url: `${site.url}/blog/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
