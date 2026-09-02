import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { getSession } from "@/lib/auth";
import { listProperties } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPropertiesPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let properties: Awaited<ReturnType<typeof listProperties>> = [];
  try {
    properties = await listProperties({ includeUnpublished: true, limit: 60 });
  } catch {
    properties = [];
  }

  return (
    <AdminShell userName={session.name}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-ink">Biens immobiliers</h1>
          <p className="mt-1 text-sm text-ink-dim">{properties.length} bien(s) enregistré(s).</p>
        </div>
        <Link href="/admin/biens/nouveau" className="btn-gold">+ Ajouter un bien</Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="p-4">Titre</th>
              <th className="p-4">Type</th>
              <th className="p-4">Prix</th>
              <th className="p-4">Ville</th>
              <th className="p-4">État</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="p-4 font-semibold text-ink">{property.title}</td>
                <td className="p-4 capitalize text-ink-dim">{property.type}</td>
                <td className="p-4 text-ink-dim">
                  {property.price_on_request
                    ? "Sur demande"
                    : formatPrice(property.price, property.price_unit)}
                </td>
                <td className="p-4 text-ink-dim">{property.city ?? "N/A"}</td>
                <td className="p-4">
                  <span
                    className={`badge ${
                      property.is_published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {property.is_published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/biens/${property.id}`} className="text-xs font-bold text-gold hover:underline">
                      Modifier
                    </Link>
                    <DeleteButton endpoint={`/api/admin/properties/${property.id}`} />
                  </div>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-faint">
                  Aucun bien pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
