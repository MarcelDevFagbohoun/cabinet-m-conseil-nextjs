import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import PropertyCard from "@/components/PropertyCard";
import { listProperties } from "@/lib/queries";
import { services, site, waLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `${site.name} - Rédaction d'actes, recouvrement, conseil juridique & immobilier`,
  description: site.description,
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage() {
  let featured: Awaited<ReturnType<typeof listProperties>> = [];

  try {
    featured = await listProperties({ limit: 3 });
  } catch (error) {
    console.error(error);
    featured = [];
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-gold/15 blur-3xl" />
        <div className="container-x relative grid gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:py-28">
          <div className="animate-fade-up flex flex-col justify-center">
            <p className="eyebrow">Cabinet M Conseils, plus de 13 ans d&apos;expérience</p>
            <h1 className="text-[42px] leading-[1.05] text-ink sm:text-[58px]">
              La rigueur du droit,
              <br />
              <span className="bg-gradient-to-r from-gold to-wine bg-clip-text text-transparent">
                l&apos;accompagnement en plus.
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-dim">
              Depuis plus de 13 ans, nous rédigeons, sécurisons et défendons les engagements les
              plus importants de nos clients (particuliers, entreprises et institutions) avec la
              même exigence pour chaque dossier.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink("Bonjour Cabinet M Conseils, je souhaite obtenir des renseignements.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Discuter sur WhatsApp
              </a>
              <Link href="/services" className="btn-ghost">
                Découvrir nos expertises
              </Link>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-4">
              {[
                { k: "13+", v: "Années d'expérience" },
                { k: "05", v: "Domaines d'expertise" },
                { k: "100%", v: "Accompagnement personnalisé" },
              ].map((stat) => (
                <div key={stat.k} className="card p-5">
                  <dt className="font-display text-3xl font-bold text-gold">{stat.k}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-ink-faint">{stat.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* IMAGE HERO : grande, animée, bien cadrée */}
          <div className="animate-fade-up relative" style={{ animationDelay: "150ms" }}>
            <div className="pointer-events-none absolute -inset-4 rounded-2xl bg-gradient-to-br from-gold/25 via-transparent to-wine/20 blur-2xl" />
            <div className="group relative h-[420px] w-full overflow-hidden rounded-2xl border border-line shadow-card sm:h-[520px] lg:h-full lg:min-h-[560px]">
              <Image
                src="/images/image6.jpg"
                alt="Cabinet M Conseils"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent" />
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-gold-light to-wine" />
            </div>
          </div>
        </div>
      </section>

      {/* EXPERTISES */}
      <section className="bg-bg-alt py-20">
        <div className="container-x">
          <p className="eyebrow">Nos expertises</p>
          <h2 className="max-w-3xl text-3xl text-ink sm:text-[40px]">
            Cinq domaines, une seule exigence : votre sécurité juridique.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-dim">
            Chaque mission est traitée avec la même rigueur, qu&apos;il s&apos;agisse d&apos;un
            contrat de quelques pages ou d&apos;un dossier de recouvrement complexe.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article key={service.id} className="card flex flex-col overflow-hidden p-0">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <span className="font-display text-2xl font-bold text-gold">{service.num}</span>
                  <h3 className="mt-3 text-xl text-ink">{service.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-dim">{service.short}</p>
                  <Link
                    href={`/services#${service.id}`}
                    className="mt-5 text-sm font-bold text-gold hover:underline"
                  >
                    Découvrir ce service →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* BIENS À LA UNE */}
      <section className="py-20">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Biens immobiliers</p>
              <h2 className="text-3xl text-ink sm:text-[38px]">Nos biens vérifiés à la une</h2>
            </div>
            <Link href="/biens-immobiliers" className="btn-ghost">
              Voir tous les biens
            </Link>
          </div>

          {featured.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featured.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-ink-dim">
              Nos biens sont en cours de publication. Contactez-nous pour connaître les
              disponibilités du moment.
            </p>
          )}
        </div>
      </section>

      {/* POURQUOI NOUS */}
      <section className="bg-bg-alt py-20">
        <div className="container-x">
          <p className="eyebrow">Pourquoi nous choisir</p>
          <h2 className="max-w-3xl text-3xl text-ink sm:text-[38px]">
            Un cabinet à taille humaine, une exigence de grand cabinet.
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                t: "Rigueur & discrétion",
                d: "Chaque dossier est traité avec confidentialité et méthode, du premier échange jusqu'à sa clôture.",
              },
              {
                t: "Disponibilité réelle",
                d: "Un accès direct par WhatsApp pour poser vos questions et suivre l'avancement de votre dossier.",
              },
              {
                t: "Tarification transparente",
                d: "Nos honoraires sont clairement expliqués avant toute mission, sans surprise ni frais cachés.",
              },
              {
                t: "Plus de 13 ans de confiance",
                d: "Une expérience éprouvée auprès de particuliers, d'entreprises et d'institutions au Bénin.",
              },
            ].map((item) => (
              <div key={item.t} className="card p-6">
                <h3 className="text-lg text-ink">{item.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-20">
        <div className="container-x">
          <div className="card overflow-hidden bg-dark p-10 text-on-dark sm:p-14">
            <p className="eyebrow !text-gold-light">
              Parlons de votre dossier
            </p>

            <h2 className="max-w-2xl text-3xl text-on-dark sm:text-[38px]">
              Une question ? Un dossier à sécuriser ? Écrivez-nous.
            </h2>

            <p className="mt-4 max-w-2xl text-on-dark-dim">
              Notre équipe vous répond rapidement pour comprendre votre besoin et vous orienter vers
              la meilleure solution, sans engagement de votre part.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={waLink("Bonjour Cabinet M Conseils, je souhaite obtenir des renseignements.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold"
              >
                Écrire sur WhatsApp
              </a>

              <Link
                href="/contact"
                className="btn border border-white/25 text-on-dark hover:bg-white/10"
              >
                Formulaire de contact
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}