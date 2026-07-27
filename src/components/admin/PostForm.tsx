"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Uploader from "./Uploader";
import type { Post } from "@/lib/types";

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cover, setCover] = useState(post?.cover_image ?? "");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      category: form.get("category") || "Juridique",
      excerpt: form.get("excerpt"),
      content: form.get("content"),
      cover_image: cover || null,
      is_published: form.get("is_published") === "on",
      meta_title: form.get("meta_title"),
      meta_description: form.get("meta_description"),
    };

    const response = await fetch(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
      method: post ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(data.error || "Enregistrement impossible.");
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md border border-wine/30 bg-wine/5 p-3 text-sm font-semibold text-wine">
          {error}
        </p>
      )}

      <section className="card space-y-4 p-6">
        <div>
          <label className="field-label" htmlFor="title">Titre *</label>
          <input id="title" name="title" required defaultValue={post?.title} className="field" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="category">Catégorie</label>
            <input id="category" name="category" defaultValue={post?.category ?? "Juridique"} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="slug">Slug (URL)</label>
            <input id="slug" name="slug" defaultValue={post?.slug ?? ""} placeholder="généré automatiquement" className="field" />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="excerpt">Chapô / résumé</label>
          <input id="excerpt" name="excerpt" maxLength={320} defaultValue={post?.excerpt ?? ""} className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="content">Contenu *</label>
          <textarea id="content" name="content" required rows={16} defaultValue={post?.content ?? ""} className="field" />
        </div>
      </section>

      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg text-ink">Image de couverture</h2>
          <Uploader label="Choisir une image" onUploaded={setCover} />
        </div>
        {cover ? (
          <p className="break-all text-xs text-ink-faint">
            {cover}{" "}
            <button type="button" onClick={() => setCover("")} className="font-bold text-wine">
              retirer
            </button>
          </p>
        ) : (
          <p className="text-sm text-ink-faint">Aucune image.</p>
        )}
      </section>

      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Référencement</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="meta_title">Titre SEO</label>
            <input id="meta_title" name="meta_title" maxLength={190} defaultValue={post?.meta_title ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="meta_description">Description SEO</label>
            <input id="meta_description" name="meta_description" maxLength={320} defaultValue={post?.meta_description ?? ""} className="field" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="is_published" defaultChecked={Boolean(post?.is_published)} />
          Publier l&apos;article
        </label>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? "Enregistrement…" : post ? "Mettre à jour" : "Créer l'article"}
        </button>
        <button type="button" onClick={() => router.push("/admin/blog")} className="btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  );
}
