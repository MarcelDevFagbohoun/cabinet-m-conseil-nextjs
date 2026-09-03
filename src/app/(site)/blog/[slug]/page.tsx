import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, listAllPostSlugs } from "@/lib/queries";
import { site } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  try {
    const rows = await listAllPostSlugs();
    return rows.map((row) => ({ slug: row.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) return { title: "Article introuvable" };

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || post.content.slice(0, 155);
  const image = post.cover_image ? `${site.url}${post.cover_image}` : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.published_at ?? undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description, images: image ? [image] : undefined },
  };
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug).catch(() => null);
  if (!post) notFound();

  const articleLd = {
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt ?? undefined,
    datePublished: post.published_at ?? post.created_at,
    dateModified: post.updated_at,
    inLanguage: "fr",
    articleSection: post.category,
    image: post.cover_image ? `${site.url}${post.cover_image}` : `${site.url}/opengraph-image`,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: { "@type": "ImageObject", url: `${site.url}/icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/blog/${post.slug}` },
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${site.url}/blog/${post.slug}`,
      },
    ],
  };

  const jsonLd = { "@context": "https://schema.org", "@graph": [articleLd, breadcrumbLd] };

  return (
    <article className="py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x max-w-3xl">
        <nav aria-label="Fil d'Ariane" className="mb-6 text-xs text-ink-faint">
          <Link href="/" className="hover:text-gold">Accueil</Link> ·{" "}
          <Link href="/blog" className="hover:text-gold">Blog</Link>
        </nav>

        <p className="eyebrow">{post.category}</p>
        <h1 className="text-3xl text-ink sm:text-[42px]">{post.title}</h1>
        <p className="mt-3 text-sm text-ink-faint">
          Publié le {formatDate(post.published_at || post.created_at)}
        </p>

        {post.cover_image && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-lg border border-line">
            <Image src={post.cover_image} alt={post.title} fill priority sizes="100vw" className="object-cover" />
          </div>
        )}

        <div className="prose-cmc mt-10 whitespace-pre-line">{post.content}</div>

        <div className="mt-12 rounded-lg border border-line bg-bg-alt p-8">
          <h2 className="text-xl text-ink">Une question sur ce sujet ?</h2>
          <p className="mt-2 text-sm text-ink-dim">
            Notre équipe répond à vos questions et vous oriente vers la bonne démarche.
          </p>
          <Link href="/contact" className="btn-gold mt-5">Nous écrire</Link>
        </div>
      </div>
    </article>
  );
}
