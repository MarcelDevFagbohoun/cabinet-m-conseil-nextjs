import Image from "next/image";
import Link from "next/link";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice, PROPERTY_TYPES } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  disponible: "bg-emerald-100 text-emerald-800",
  reserve: "bg-amber-100 text-amber-800",
  vendu: "bg-neutral-200 text-neutral-700",
  loue: "bg-neutral-200 text-neutral-700",
};

const statusLabels: Record<string, string> = {
  disponible: "Disponible",
  reserve: "Réservé",
  vendu: "Vendu",
  loue: "Loué",
};

// Images de secours utilisées quand une propriété n'a pas de cover_image
const FALLBACK_IMAGES = [
  "/images/image1.jpeg",
  "/images/image2.jpeg",
  "/images/image3.jpeg",
  "/images/image4.jpeg",
  "/images/image5.jpeg",
];

export default function PropertyCard({
  property,
  index = 0,
}: {
  property: Property;
  index?: number;
}) {
  const typeLabel =
    PROPERTY_TYPES.find((t) => t.value === property.type)?.label ?? property.type;
  const area = formatArea(property.area_sqm);

  const imageSrc =
    property.cover_image ?? FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  const price = property.price_on_request
    ? "Prix sur demande"
    : formatPrice(property.price, property.price_unit);

  const location = [property.district, property.city].filter(Boolean).join(", ");

  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-raise focus-within:-translate-y-1 focus-within:shadow-raise focus-within:ring-2 focus-within:ring-gold/40">
      <Link
        href={`/biens-immobiliers/${property.slug}`}
        className="flex h-full flex-col outline-none"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 360px"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          {/* Transaction : toujours visible */}
          <span className="badge absolute left-2 top-2 bg-dark/85 px-2 py-0.5 text-[9px] text-on-dark sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[11px]">
            {property.transaction === "vente" ? "À vendre" : "À louer"}
          </span>
          {/* Statut : masqué sur très petits écrans pour ne pas surcharger la vignette */}
          <span
            className={`badge absolute right-2 top-2 hidden px-2 py-0.5 text-[9px] sm:right-3 sm:top-3 sm:inline-flex sm:px-3 sm:py-1 sm:text-[11px] ${
              statusStyles[property.status] ?? ""
            }`}
          >
            {statusLabels[property.status] ?? property.status}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-3.5 sm:p-6">
          <p className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-gold sm:text-[11px] sm:tracking-[0.2em]">
            {typeLabel}
          </p>
          <h3 className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-ink sm:mt-2 sm:text-lg">
            {property.title}
          </h3>
          {location && (
            <p className="mt-1 line-clamp-1 text-[11px] text-ink-faint sm:text-sm">
              {location}
            </p>
          )}
          {property.excerpt && (
            <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-ink-dim sm:mt-3 sm:block">
              {property.excerpt}
            </p>
          )}

          <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3 sm:mt-auto sm:flex-row sm:items-end sm:justify-between sm:pt-4">
            <p className="font-display text-[13px] font-bold text-ink sm:text-lg">
              {price}
            </p>
            {(area || property.bedrooms) && (
              <div className="flex flex-wrap gap-x-2 gap-y-0 text-[10px] text-ink-faint sm:flex-col sm:text-right sm:text-xs">
                {area && <span>{area}</span>}
                {property.bedrooms ? (
                  <span>
                    {property.bedrooms}
                    <span className="sm:hidden">&nbsp;ch.</span>
                    <span className="hidden sm:inline">&nbsp;chambres</span>
                  </span>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
