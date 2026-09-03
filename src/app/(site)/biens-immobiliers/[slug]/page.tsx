import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContactForm from "@/components/ContactForm";
import Gallery from "@/components/Gallery";
import { getPropertyBySlug, listAllPropertySlugs } from "@/lib/queries";
import { site, waLink } from "@/lib/site";
import { DOC_TYPES, formatArea, formatPrice, PROPERTY_TYPES } from "@/lib/utils";

export const revalidate = 120;

export async function generateStaticParams() {
  try {
    const rows = await listAllPropertySlugs();
    return rows.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const property = await getPropertyBySlug(params.slug).catch(() => null);
  if (!property) return { title: "Bien introuvable" };

  const title = property.meta_title || property.title;
  const description =
    property.meta_description ||
    property.excerpt ||
    `${property.title} : bien vérifié par le Cabinet M Conseils.`;
  const image = property.cover_image ? `${site.url}${property.cover_image}` : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/biens-immobiliers/${property.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/biens-immobiliers/${property.slug}`,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const property = await getPropertyBySlug(params.slug).catch(() => null);
  if (!property) notFound();

  const typeLabel = PROPERTY_TYPES.find((t) => t.value === property.type)?.label ?? property.type;
  const area = formatArea(property.area_sqm);
  const price = property.price_on_request
    ? "Prix sur demande"
    : formatPrice(property.price, property.price_unit);

  const images = property.images.length
    ? property.images
    : property.cover_image
      ? [{ id: 0, property_id: property.id, url: property.cover_image, alt: property.title, position: 0 }]
      : [];

  const listingLd = {
    "@type": "RealEstateListing",
    name: property.title,
    description: property.excerpt || property.description?.slice(0, 300),
    url: `${site.url}/biens-immobiliers/${property.slug}`,
    image: images.map((image) => `${site.url}${image.url}`),
    ...(property.area_sqm
      ? { floorSize: { "@type": "QuantitativeValue", value: Number(property.area_sqm), unitCode: "MTK" } }
      : {}),
    ...(property.bedrooms ? { numberOfRooms: property.bedrooms } : {}),
    ...(property.price && !property.price_on_request
      ? {
          offers: {
            "@type": "Offer",
            price: Number(property.price),
            priceCurrency: "XOF",
            availability:
              property.status === "disponible"
                ? "https://schema.org/InStock"
                : "https://schema.org/SoldOut",
          },
        }
      : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city ?? "Cotonou",
      addressCountry: "BJ",
    },
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      {
        "@type": "ListItem",
        position: 2,
        name: "Biens immobiliers",
        item: `${site.url}/biens-immobiliers`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: `${site.url}/biens-immobiliers/${property.slug}`,
      },
    ],
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [listingLd, breadcrumbLd] };

  const specs = [
    { label: "Type", value: typeLabel },
    { label: "Transaction", value: property.transaction === "vente" ? "À vendre" : "À louer" },
    { label: "Statut", value: property.status },
    { label: "Superficie", value: area },
    { label: "Localisation", value: [property.district, property.city].filter(Boolean).join(", ") },
    { label: "Chambres", value: property.bedrooms },
    { label: "Salles d'eau", value: property.bathrooms },
    { label: "Niveaux", value: property.floors },
    { label: "Année de construction", value: property.year_built },
  ].filter((spec) => spec.value !== null && spec.value !== undefined && spec.value !== "");

  return (
    <article className="py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-xs text-ink-faint">
          <Link href="/" className="hover:text-gold">Accueil</Link> ·{" "}
          <Link href="/biens-immobiliers" className="hover:text-gold">Biens immobiliers</Link> ·{" "}
          <span className="text-ink-dim">{property.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
          <div>
            <Gallery images={images} title={property.title} />

            <header className="mt-8">
              <p className="eyebrow">{typeLabel}</p>
              <h1 className="text-3xl text-ink sm:text-[40px]">{property.title}</h1>
              {(property.city || property.district) && (
                <p className="mt-2 text-ink-faint">
                  {[property.district, property.city, property.address].filter(Boolean).join(" · ")}
                </p>
              )}
            </header>

            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-raised p-4">
                  <dt className="text-[11px] font-extrabold uppercase tracking-widest text-ink-faint">
                    {spec.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold capitalize text-ink">{String(spec.value)}</dd>
                </div>
              ))}
            </dl>

            {property.description && (
              <section className="mt-10">
                <h2 className="text-2xl text-ink">Description</h2>
                <div className="prose-cmc mt-4 whitespace-pre-line">{property.description}</div>
              </section>
            )}

            {property.amenities?.length ? (
              <section className="mt-10">
                <h2 className="text-2xl text-ink">Équipements et atouts</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {property.amenities.map((item) => (
                    <li key={item} className="badge border border-line bg-bg-alt text-ink-dim">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {property.documents.length > 0 && (
              <section className="mt-10">
                <h2 className="text-2xl text-ink">Documents disponibles</h2>
                <ul className="mt-4 divide-y divide-line overflow-hidden rounded-lg border border-line">
                  {property.documents.map((doc) => (
                    <li key={doc.id} className="flex items-center justify-between gap-4 bg-raised p-4">
                      <div>
                        <p className="text-sm font-semibold text-ink">{doc.label}</p>
                        <p className="text-xs text-ink-faint">
                          {DOC_TYPES.find((d) => d.value === doc.doc_type)?.label ?? doc.doc_type}
                        </p>
                      </div>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost !px-4 !py-2 text-xs"
                      >
                        Consulter
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {property.legal_notes && (
              <section className="mt-10 rounded-lg border-l-4 border-gold bg-bg-alt p-6">
                <h2 className="text-lg text-ink">Note juridique du cabinet</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-dim">
                  {property.legal_notes}
                </p>
              </section>
            )}
          </div>

          {/* Colonne latérale */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-6">
              <p className="text-xs font-extrabold uppercase tracking-widest text-ink-faint">Prix</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{price}</p>
              {area && <p className="mt-1 text-sm text-ink-faint">Superficie : {area}</p>}
              <a
                href={waLink(
                  `Bonjour Cabinet M Conseils, je suis intéressé(e) par le bien « ${property.title} » (${site.url}/biens-immobiliers/${property.slug}).`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold mt-5 w-full"
              >
                Demander une visite
              </a>
              <p className="mt-3 text-center text-xs text-ink-faint">
                Réponse rapide · {site.whatsappDisplay}
              </p>
            </div>

            <ContactForm propertyId={property.id} defaultSubject={`Bien : ${property.title}`} />
          </aside>
        </div>
      </div>
    </article>
  );
}
