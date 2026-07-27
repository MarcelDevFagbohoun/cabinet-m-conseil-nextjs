import type { Metadata } from "next";
import Link from "next/link";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos du cabinet",
  description:
    "Cabinet M Conseils, plus de 13 ans au service des particuliers, entreprises et institutions au Bénin : rédaction d'actes, recouvrement, conseil juridique et immobilier.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "À propos — Cabinet M Conseils",
    description:
      "Un cabinet à taille humaine, une exigence de grand cabinet. Plus de 13 ans d'accompagnement juridique et immobilier au Bénin.",
    url: "/a-propos",
  },
};

export default function AProposPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="container-x max-w-4xl">
          <p className="eyebrow">Le cabinet</p>
          <h1 className="text-3xl text-ink sm:text-[42px]">
            Derrière chaque acte, une confiance à protéger.
          </h1>
          <blockquote className="mt-8 border-l-4 border-gold pl-6 font-display text-xl leading-relaxed text-ink">
            « Derrière chaque acte que nous rédigeons, il y a une personne, une famille ou une
            entreprise qui nous fait confiance. C&apos;est cette confiance que nous protégeons,
            dossier après dossier, depuis plus de treize ans. »
            <footer className="mt-4 text-sm font-body font-semibold uppercase tracking-widest text-ink-faint">
              L&apos;équipe du Cabinet M Conseils
            </footer>
          </blockquote>

          <div className="prose-cmc mt-10">
            <p>
              Installé à Cotonou et intervenant partout au Bénin, le Cabinet M Conseils accompagne
              particuliers, entreprises et institutions sur l&apos;ensemble du cycle de vie de leurs
              engagements : de la rédaction de l&apos;acte à son exécution, jusqu&apos;au
              recouvrement lorsque cela devient nécessaire.
            </p>
            <p>
              Notre conviction est simple : un dossier bien préparé évite un contentieux coûteux.
              C&apos;est pourquoi nous consacrons autant d&apos;attention à la rédaction et à la
              vérification qu&apos;à la défense de vos intérêts.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-16">
        <div className="container-x grid gap-6 sm:grid-cols-3">
          {[
            {
              k: "13+",
              t: "Années d'accompagnement",
              d: "Plus d'une décennie passée aux côtés de nos clients, sur des dossiers simples comme complexes.",
            },
            {
              k: "05",
              t: "Domaines d'intervention",
              d: "Rédaction d'actes, recouvrement, conseil juridique, immobilier et veille — sous un même toit.",
            },
            {
              k: "01",
              t: "Interlocuteur, du début à la fin",
              d: "Un accompagnement suivi, sans dilution de responsabilité entre plusieurs intervenants.",
            },
          ].map((item) => (
            <div key={item.k} className="card p-7">
              <span className="font-display text-3xl font-bold text-gold">{item.k}</span>
              <h2 className="mt-3 text-lg text-ink">{item.t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-dim">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 rounded-lg border border-line bg-raised p-10">
          <div>
            <h2 className="text-2xl text-ink">Parlons de votre situation</h2>
            <p className="mt-2 text-sm text-ink-dim">
              WhatsApp {site.whatsappDisplay} · Tél. {site.phone}
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={waLink("Bonjour Cabinet M Conseils, je souhaite échanger avec votre équipe.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
            >
              WhatsApp
            </a>
            <Link href="/contact" className="btn-ghost">
              Nous écrire
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
