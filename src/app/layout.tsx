import type { Metadata, Viewport } from "next";
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/CookieConsent";
import { site } from "@/lib/site";

const display = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Conseil juridique & immobilier au Bénin | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  keywords: [
    "conseils juridiques au Bénin",
    "cabinet juridique Bénin",
    "cabinet juridique Cotonou",
    "conseil juridique Cotonou",
    "achat et vente de biens immobiliers Bénin",
    "achat fiable et sécurisé de biens immobiliers",
    "biens immobiliers vérifiés Bénin",
    "numéro 1 du conseil juridique et immobilier au Bénin",
    "rédaction de contrats Cotonou",
    "recouvrement de créances Bénin",
    "titre foncier Bénin",
    "parcelle à vendre Bénin",
    "maison à vendre Cotonou",
    "appartement à louer Cotonou",
    "gestion locative Bénin",
    "agence immobilière fiable Bénin",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    title: `Conseil juridique & immobilier au Bénin | ${site.name}`,
    description: site.description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: `Conseil juridique & immobilier au Bénin | ${site.name}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: "#8d4b00",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.png`,
        image: `${site.url}/opengraph-image`,
        description: site.description,
        telephone: site.phone,
        areaServed: { "@type": "Country", name: "Bénin" },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cotonou",
          addressCountry: "BJ",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        inLanguage: "fr",
        publisher: { "@id": `${site.url}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${site.url}/biens-immobiliers?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "LegalService",
        "@id": `${site.url}/#legalservice`,
        name: site.name,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        description: site.description,
        telephone: site.phone,
        priceRange: "€€",
        areaServed: { "@type": "Country", name: "Bénin" },
        parentOrganization: { "@id": `${site.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cotonou",
          addressCountry: "BJ",
        },
        knowsLanguage: ["fr"],
        serviceType: [
          "Rédaction de contrats et actes juridiques",
          "Recouvrement de créances",
          "Conseil et assistance juridiques",
          "Vente, achat et gestion de biens immobiliers",
          "Veille et information juridiques",
        ],
      },
    ],
  };

  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <head>
        {/* Les images des biens sont servies depuis Vercel Blob */}
        <link rel="preconnect" href="https://blob.vercel-storage.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://blob.vercel-storage.com" />
      </head>
      <body className="grain">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="relative z-10">{children}</div>
        <CookieConsent />
      </body>
    </html>
  );
}
