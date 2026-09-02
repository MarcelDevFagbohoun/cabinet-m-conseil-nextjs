import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Cabinet M Conseils à Cotonou : WhatsApp, téléphone ou formulaire. Réponse rapide pour vos besoins juridiques et immobiliers au Bénin.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact | Cabinet M Conseils",
    description: "Écrivez-nous : notre équipe vous répond rapidement, sans engagement.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow">Contact</p>
          <h1 className="text-3xl text-ink sm:text-[42px]">Parlons de votre dossier.</h1>
          <p className="mt-4 text-ink-dim">
            Une question, un contrat à sécuriser, un bien à vendre ou à acheter ? Décrivez-nous
            votre besoin, nous revenons vers vous rapidement.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">WhatsApp</dt>
              <dd className="mt-1 text-ink">
                <a
                  className="hover:underline"
                  href={waLink("Bonjour Cabinet M Conseils, je souhaite obtenir des renseignements.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.whatsappDisplay}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Téléphone / Bureau</dt>
              <dd className="mt-1 text-ink">{site.phone}</dd>
            </div>
            <div>
              <dt className="text-xs font-extrabold uppercase tracking-[0.2em] text-gold">Adresse</dt>
              <dd className="mt-1 text-ink">{site.city}</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
