import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Rédaction d'actes, recouvrement, conseil juridique & immobilier`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [
    "cabinet juridique Bénin",
    "rédaction de contrats Cotonou",
    "recouvrement de créances",
    "conseil juridique",
    "parcelle à vendre Bénin",
    "maison à vendre Cotonou",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `${site.name} — Conseils juridiques & immobilier`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Conseils juridiques & immobilier`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    areaServed: "Bénin",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cotonou",
      addressCountry: "BJ",
    },
  };

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
