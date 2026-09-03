import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { getSession } from "@/lib/auth";
import { listProperties } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: { q?: string; page?: string };
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const q = (searchParams.q ?? "").trim();
  const page = Math.max(Number(searchParams.page) || 1, 1);

  let rows: Awaited<ReturnType<typeof listProperties>> = [];
  try {
    rows = await listProperties({
      includeUnpublished: true,
      q: q || undefined,
      limit: PAGE_SIZE + 1,
      offset: (page - 1) * PAGE_SIZE,
    });
  } catch {
    rows = [];
  }

  const hasNext = rows.length > PAGE_SIZE;
  const properties = rows.slice(0, PAGE_SIZE);
  const pageHref = (p: number) =>
    `/admin/biens?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <AdminShell userName={session.name}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl text-ink">Biens immobiliers</h1>
        <Link href="/admin/biens/nouveau" className="btn-gold">
          + Ajouter un bien
        </Link>
      </div>

      <form method="get" className="mt-4 flex gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Rechercher un titre, une ville, un quartier…"
          className="field"
        />
        <button type="submit" className="btn-ghost !py-2 text-sm">
          Rechercher
        </button>
        {q && (
          <Link href="/admin/biens" className="btn-ghost !py-2 text-sm">
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="card mt-6 divide-y divide-line">
        {properties.map((property) => (
          <div
            key={property.id}
            className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="font-semibold text-ink">{property.title}</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                <span className="capitalize">{property.type}</span>
                {" · "}
                {property.price_on_request
                  ? "Sur demande"
                  : formatPrice(property.price, property.price_unit)}
                {property.city ? ` · ${property.city}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-4 sm:shrink-0">
              <span
                className={`badge ${
                  property.is_published
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-neutral-200 text-neutral-700"
                }`}
              >
                {property.is_published ? "Publié" : "Brouillon"}
              </span>
              <Link
                href={`/admin/biens/${property.id}`}
                className="text-xs font-bold text-gold hover:underline"
              >
                Modifier
              </Link>
              <DeleteButton endpoint={`/api/admin/properties/${property.id}`} />
            </div>
          </div>
        ))}

        {properties.length === 0 && (
          <p className="p-8 text-center text-ink-faint">
            {q ? "Aucun bien ne correspond à cette recherche." : "Aucun bien pour le moment."}
          </p>
        )}
      </div>

      {(page > 1 || hasNext) && (
        <div className="mt-4 flex items-center justify-between text-sm">
          {page > 1 ? (
            <Link href={pageHref(page - 1)} className="btn-ghost !py-2">
              ← Précédent
            </Link>
          ) : (
            <span />
          )}
          <span className="text-ink-faint">Page {page}</span>
          {hasNext ? (
            <Link href={pageHref(page + 1)} className="btn-ghost !py-2">
              Suivant →
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </AdminShell>
  );
}
