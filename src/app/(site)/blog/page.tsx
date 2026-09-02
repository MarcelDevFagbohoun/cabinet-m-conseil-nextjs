import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listPosts } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog juridique et immobilier",
  description:
    "Articles, veille et informations juridiques du Cabinet M Conseils : contrats, recouvrement, droit immobilier et actualités utiles au Bénin.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Cabinet M Conseils",
    description: "Veille juridique et conseils pratiques, expliqués simplement.",
    url: "/blog",
  },
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof listPosts>> = [];
  try {
    posts = await listPosts();
  } catch {
    posts = [];
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <p className="eyebrow">Blog</p>
        <h1 className="max-w-3xl text-3xl text-ink sm:text-[42px]">
          Le droit expliqué simplement, dossier après dossier.
        </h1>
        <p className="mt-4 max-w-2xl text-ink-dim">
          Nos analyses et informations juridiques utiles, rédigées par le cabinet.
        </p>

        {posts.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.id} className="card overflow-hidden transition hover:-translate-y-1 hover:shadow-raise">
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative aspect-[16/10] bg-bg-alt">
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-6">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-gold">
                      {post.category}
                    </p>
                    <h2 className="mt-2 line-clamp-2 text-lg text-ink">{post.title}</h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-dim">
                        {post.excerpt}
                      </p>
                    )}
                    <p className="mt-4 text-xs text-ink-faint">
                      {formatDate(post.published_at || post.created_at)}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-lg border border-dashed border-line-strong p-10 text-center text-ink-dim">
            Les premiers articles arrivent très bientôt.
          </p>
        )}
      </div>
    </section>
  );
}
