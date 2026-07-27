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

  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-raise">
      <Link href={`/biens-immobiliers/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-bg-alt">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <span className={`badge absolute left-4 top-4 ${statusStyles[property.status] ?? ""}`}>
            {property.status}
          </span>
          <span className="badge absolute right-4 top-4 bg-dark/85 text-on-dark">
            {property.transaction === "vente" ? "À vendre" : "À louer"}
          </span>
        </div>

        <div className="p-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
            {typeLabel}
          </p>
          <h3 className="mt-2 line-clamp-2 text-lg text-ink">{property.title}</h3>
          {(property.city || property.district) && (
            <p className="mt-1 text-sm text-ink-faint">
              {[property.district, property.city].filter(Boolean).join(", ")}
            </p>
          )}
          {property.excerpt && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-dim">
              {property.excerpt}
            </p>
          )}

          <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
            <p className="font-display text-lg font-bold text-ink">
              {property.price_on_request
                ? "Prix sur demande"
                : formatPrice(property.price, property.price_unit)}
            </p>
            <div className="text-right text-xs text-ink-faint">
              {area && <p>{area}</p>}
              {property.bedrooms ? <p>{property.bedrooms} chambres</p> : null}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}