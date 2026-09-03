import type { Metadata } from "next";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { listProperties, listPropertyCities } from "@/lib/queries";
import { PROPERTY_TYPES } from "@/lib/utils";
import { site } from "@/lib/site";

// Rendu à la demande : la page lit searchParams (recherche + filtres).
// Avec `revalidate`, Next servait la version en cache et ignorait les filtres.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Biens immobiliers à vendre et à louer au Bénin",
  description:
    "Parcelles, maisons et appartements vérifiés par le Cabinet M Conseils : photos, superficie, documents et titre foncier contrôlés avant publication.",
  alternates: { canonical: "/biens-immobiliers" },
  openGraph: {
    title: "Biens immobiliers | Cabinet M Conseils",
    description:
      "Une sélection de parcelles et de maisons vérifiées juridiquement, à Cotonou et partout au Bénin.",
    url: "/biens-immobiliers",
  },
};

type SearchParams = {
  type?: string;
  transaction?: string;
  city?: string;
  q?: string;
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  let properties: Awaited<ReturnType<typeof listProperties>> = [];
  let cities: string[] = [];
  let dbError = false;

  try {
    [properties, cities] = await Promise.all([
      listProperties({
        type: searchParams.type,
        transaction: searchParams.transaction,
        city: searchParams.city,
        q: searchParams.q,
        limit: 60,
      }),
      listPropertyCities(),
    ]);
  } catch {
    dbError = true;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: properties.map((property, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${site.url}/biens-immobiliers/${property.slug}`,
      name: property.title,
    })),
  };

  return (
    <section className="py-16 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x">
        <p className="eyebrow">Biens immobiliers</p>
        <h1 className="max-w-3xl text-3xl text-ink sm:text-[42px]">
          Parcelles et maisons, vérifiées avant d&apos;être proposées.
        </h1>
        <p className="mt-4 max-w-2xl text-ink-dim">
          Chaque bien présenté ici a été contrôlé par notre cabinet : titre foncier, bornage,
          absence de litige. Photos, superficie et documents sont consultables sur chaque fiche.
        </p>

        {/* Filtres — repliables sur mobile, toujours visibles à partir de sm */}
        <details open className="group mt-8 sm:mt-10 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-line bg-raised px-5 py-3.5 text-sm font-bold text-ink sm:hidden">
            Rechercher un bien
            <span className="text-gold transition-transform duration-300 group-open:rotate-180">▾</span>
          </summary>
          <form className="filters-panel mt-3 grid gap-3 rounded-lg border border-line bg-raised p-4 sm:mt-0 sm:grid-cols-2 sm:p-5 lg:grid-cols-5">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="field-label" htmlFor="q">Recherche</label>
              <input id="q" name="q" defaultValue={searchParams.q} placeholder="Quartier, mot-clé…" className="field" />
            </div>
            <div>
              <label className="field-label" htmlFor="type">Type de bien</label>
              <select id="type" name="type" defaultValue={searchParams.type ?? ""} className="field">
                <option value="">Tous</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="transaction">Transaction</label>
              <select id="transaction" name="transaction" defaultValue={searchParams.transaction ?? ""} className="field">
                <option value="">Toutes</option>
                <option value="vente">À vendre</option>
                <option value="location">À louer</option>
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="city">Ville</label>
              <select id="city" name="city" defaultValue={searchParams.city ?? ""} className="field">
                <option value="">Toutes</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1">
              <button type="submit" className="btn-gold flex-1">Filtrer</button>
              <Link href="/biens-immobiliers" className="btn-ghost">Effacer</Link>
            </div>
          </form>
        </details>

        {dbError ? (
          <p className="mt-10 rounded-md border border-line bg-raised p-6 text-ink-dim">
            La liste des biens est momentanément indisponible. Merci de réessayer dans quelques
            instants.
          </p>
        ) : properties.length ? (
          <>
            <p className="mt-8 text-sm text-ink-faint sm:mt-10">
              {properties.length} bien{properties.length > 1 ? "s" : ""} disponible
              {properties.length > 1 ? "s" : ""}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          </>
        ) : (
          <div className="mt-12 rounded-lg border border-dashed border-line-strong p-10 text-center">
            <p className="font-display text-xl text-ink">Aucun bien ne correspond à ces critères.</p>
            <p className="mt-2 text-sm text-ink-dim">
              Élargissez votre recherche ou contactez-nous : certains biens ne sont pas encore
              publiés en ligne.
            </p>
            <Link href="/contact" className="btn-gold mt-6">Nous contacter</Link>
          </div>
        )}
      </div>
    </section>
  );
}
