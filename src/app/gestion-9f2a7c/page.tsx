import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { getSession } from "@/lib/auth";
import { getAdminStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await getSession();
  if (!session) redirect("/gestion-9f2a7c/login");

  let stats = { properties: 0, publishedProperties: 0, posts: 0, unreadMessages: 0 };
  let dbError = false;
  try {
    stats = await getAdminStats();
  } catch {
    dbError = true;
  }

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl text-ink">Tableau de bord</h1>
      <p className="mt-1 text-sm text-ink-dim">
        Ajoutez, modifiez et publiez vos biens immobiliers et vos articles.
      </p>

      {dbError && (
        <p className="mt-6 rounded-md border border-wine/30 bg-wine/5 p-4 text-sm text-wine">
          Connexion à la base de données impossible. Vérifiez votre fichier <code>.env</code>.
        </p>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Biens enregistrés", value: stats.properties, href: "/gestion-9f2a7c/biens" },
          { label: "Biens publiés", value: stats.publishedProperties, href: "/gestion-9f2a7c/biens" },
          { label: "Articles", value: stats.posts, href: "/gestion-9f2a7c/blog" },
          { label: "Messages non lus", value: stats.unreadMessages, href: "/gestion-9f2a7c/messages" },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className="card p-5 transition hover:border-gold/40">
            <p className="font-display text-3xl font-bold text-gold">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-ink-faint">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/gestion-9f2a7c/biens/nouveau" className="btn-gold">+ Ajouter un bien</Link>
        <Link href="/gestion-9f2a7c/blog/nouveau" className="btn-ghost">+ Écrire un article</Link>
        <Link href="/gestion-9f2a7c/messages" className="btn-ghost">Voir les messages</Link>
      </div>
    </AdminShell>
  );
}
