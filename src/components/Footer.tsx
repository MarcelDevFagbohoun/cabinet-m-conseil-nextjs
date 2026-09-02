import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-dark text-on-dark-dim">
      <div className="container-x grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="font-display text-xl font-bold text-on-dark">
            Cabinet <em className="not-italic text-gold-light">M</em> Conseils
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Rédaction d&apos;actes, recouvrement, conseil juridique et immobilier, à vos côtés
            depuis plus de 13 ans, à Cotonou et partout au Bénin.
          </p>
        </div>

        <nav aria-label="Navigation de pied de page">
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-on-dark">
            Navigation
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-gold-light" href="/">Accueil</Link></li>
            <li><Link className="hover:text-gold-light" href="/services">Services</Link></li>
            <li><Link className="hover:text-gold-light" href="/biens-immobiliers">Biens immobiliers</Link></li>
            <li><Link className="hover:text-gold-light" href="/blog">Blog</Link></li>
            <li><Link className="hover:text-gold-light" href="/a-propos">À propos</Link></li>
            <li><Link className="hover:text-gold-light" href="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-on-dark">
            Expertises
          </h2>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-gold-light" href="/services#redaction">Rédaction de contrats</Link></li>
            <li><Link className="hover:text-gold-light" href="/services#recouvrement">Recouvrement de créances</Link></li>
            <li><Link className="hover:text-gold-light" href="/services#conseil">Conseil juridique</Link></li>
            <li><Link className="hover:text-gold-light" href="/services#immobilier">Immobilier</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xs font-extrabold uppercase tracking-[0.2em] text-on-dark">
            Contact
          </h2>
          <ul className="space-y-2 text-sm">
            <li>WhatsApp : {site.whatsappDisplay}</li>
            <li>Tél : {site.phone}</li>
            <li>
              <a className="hover:text-gold-light" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a className="hover:text-gold-light" href={site.facebook} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cabinet M Conseils. Tous droits réservés.</p>
          <p>{site.city}</p>
        </div>
      </div>
    </footer>
  );
}
