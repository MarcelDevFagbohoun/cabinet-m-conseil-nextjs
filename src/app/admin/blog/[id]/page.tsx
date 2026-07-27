import { notFound, redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";
import { getSession } from "@/lib/auth";
import { getPostById } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminPostEditPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const isNew = params.id === "nouveau";
  const post = isNew ? undefined : await getPostById(Number(params.id)).catch(() => null);
  if (!isNew && !post) notFound();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl text-ink">
        {isNew ? "Nouvel article" : `Modifier : ${post!.title}`}
      </h1>
      <div className="mt-8">
        <PostForm post={post ?? undefined} />
      </div>
    </AdminShell>
  );
}
