import type { Metadata } from "next";
import ServiceTabs from "@/components/ServiceTabs";

export const metadata: Metadata = {
  title: "Nos services juridiques et immobiliers",
  description:
    "Rédaction de contrats, recouvrement de créances, conseil juridique, vente et gestion de biens immobiliers, veille juridique : découvrez les cinq expertises du Cabinet M Conseils.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Nos services | Cabinet M Conseils",
    description:
      "Cinq expertises au service de votre sécurité juridique : contrats, recouvrement, conseil, immobilier, information juridique.",
    url: "/services",
  },
};

export default function ServicesPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <p className="eyebrow">Nos services</p>
        <h1 className="max-w-3xl text-3xl text-ink sm:text-[42px]">
          Choisissez un service, nous vous répondons directement sur WhatsApp.
        </h1>
        <p className="mt-4 max-w-2xl text-ink-dim">
          Sélectionnez l&apos;expertise qui correspond à votre besoin pour en découvrir le détail,
          puis contactez-nous en un clic : le message se prépare automatiquement pour vous.
        </p>

        <div className="mt-12">
          <ServiceTabs />
        </div>
      </div>
    </section>
  );
}
