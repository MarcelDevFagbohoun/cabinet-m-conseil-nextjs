import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PropertyForm from "@/components/admin/PropertyForm";
import { getSession } from "@/lib/auth";
import { getPropertyById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPropertyEditPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/gestion-9f2a7c/login");

  const isNew = params.id === "nouveau";
  const property = isNew ? undefined : await getPropertyById(Number(params.id)).catch(() => null);
  if (!isNew && !property) notFound();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl text-ink">
        {isNew ? "Ajouter un bien immobilier" : `Modifier : ${property!.title}`}
      </h1>
      <p className="mt-1 text-sm text-ink-dim">
        Renseignez les informations, ajoutez les photos et les documents, puis publiez.
      </p>

      <div className="mt-8">
        <PropertyForm property={property ?? undefined} />
      </div>
    </AdminShell>
  );
}
