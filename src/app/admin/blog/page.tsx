import Link from "next/link";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import DeleteButton from "@/components/admin/DeleteButton";
import { getSession } from "@/lib/auth";
import { listPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  try {
    posts = await listPosts({ includeUnpublished: true, limit: 60 });
  } catch {
    posts = [];
  }

  return (
    <AdminShell userName={session.name}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-ink">Articles du blog</h1>
          <p className="mt-1 text-sm text-ink-dim">{posts.length} article(s).</p>
        </div>
        <Link href="/admin/blog/nouveau" className="btn-gold">+ Écrire un article</Link>
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-widest text-ink-faint">
            <tr>
              <th className="p-4">Titre</th>
              <th className="p-4">Catégorie</th>
              <th className="p-4">Publication</th>
              <th className="p-4">État</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="p-4 font-semibold text-ink">{post.title}</td>
                <td className="p-4 text-ink-dim">{post.category}</td>
                <td className="p-4 text-ink-dim">
                  {post.published_at ? formatDate(post.published_at) : "Non publié"}
                </td>
                <td className="p-4">
                  <span
                    className={`badge ${
                      post.is_published
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-neutral-200 text-neutral-700"
                    }`}
                  >
                    {post.is_published ? "Publié" : "Brouillon"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-4">
                    <Link href={`/admin/blog/${post.id}`} className="text-xs font-bold text-gold hover:underline">
                      Modifier
                    </Link>
                    <DeleteButton endpoint={`/api/admin/posts/${post.id}`} />
                  </div>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-ink-faint">
                  Aucun article pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
