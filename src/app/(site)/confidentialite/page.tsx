import type { Metadata } from "next";
import Link from "next/link";
import CookiePreferencesButton from "@/components/CookiePreferencesButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Comment le Cabinet M Conseils collecte et protège vos données personnelles, conformément à la loi n° 2017-20 portant Code du numérique en République du Bénin.",
  alternates: { canonical: "/confidentialite" },
};

const updated = "septembre 2026";

export default function ConfidentialitePage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x max-w-3xl">
        <p className="eyebrow">Données personnelles</p>
        <h1 className="text-3xl text-ink sm:text-[42px]">Politique de confidentialité</h1>
        <p className="mt-3 text-sm text-ink-faint">Dernière mise à jour : {updated}</p>

        <div className="prose-cmc mt-10">
          <h2>1. Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données collectées sur ce site est le{" "}
            <strong>{site.name}</strong>, établi à {site.city}.
            <br />
            Contact : <a href={`mailto:${site.email}`}>{site.email}</a> — WhatsApp&nbsp;:{" "}
            {site.whatsappDisplay}.
          </p>

          <h2>2. Cadre juridique</h2>
          <p>
            Le traitement de vos données personnelles est réalisé conformément à la{" "}
            <strong>
              loi n° 2017-20 du 20 avril 2018 portant Code du numérique en République du Bénin
            </strong>{" "}
            (Livre cinquième, relatif à la protection des données à caractère personnel) et sous le
            contrôle de l&apos;<strong>Autorité de Protection des Données Personnelles (APDP)</strong>{" "}
            du Bénin.
          </p>

          <h2>3. Données que nous collectons</h2>
          <h3>a. Formulaire de contact</h3>
          <p>
            Lorsque vous nous écrivez via le formulaire, nous collectons votre nom, votre adresse
            e-mail, votre numéro de téléphone (facultatif) et le contenu de votre message. Ces
            données servent uniquement à traiter votre demande. Base légale : votre démarche
            volontaire et votre consentement.
          </p>
          <h3>b. Mesure d&apos;audience (Microsoft Clarity)</h3>
          <p>
            Avec votre consentement préalable, nous utilisons Microsoft Clarity pour analyser
            l&apos;usage du site (pages consultées, type d&apos;appareil, interactions, statistiques
            de navigation, enregistrements de session anonymisés). Le contenu que vous saisissez
            dans les formulaires est masqué par défaut dans ces enregistrements. Aucun de ces
            traitements n&apos;est activé tant que vous n&apos;avez pas cliqué sur «&nbsp;Accepter&nbsp;»
            dans le bandeau prévu à cet effet.
          </p>
          <h3>c. Cookies et traceurs</h3>
          <p>
            Le site ne dépose des cookies de mesure d&apos;audience qu&apos;<strong>après votre
            accord</strong>. Un choix technique (accepté / refusé) est conservé dans votre
            navigateur pour ne plus vous solliciter à chaque visite ; il ne s&apos;agit pas d&apos;un
            traceur publicitaire.
          </p>

          <h2>4. Transfert de données hors du Bénin</h2>
          <p>
            Les données de mesure d&apos;audience sont traitées par Microsoft et hébergées sur des
            serveurs situés hors du Bénin. Ce transfert n&apos;a lieu qu&apos;avec votre
            consentement et est encadré par les engagements contractuels de Microsoft en matière de
            sécurité et de confidentialité.
          </p>

          <h2>5. Durée de conservation</h2>
          <ul>
            <li>Messages de contact : conservés le temps nécessaire au traitement de votre demande, puis archivés ou supprimés.</li>
            <li>Données de mesure d&apos;audience : conservées conformément aux paramètres de Microsoft Clarity (généralement plusieurs mois), puis supprimées automatiquement.</li>
          </ul>

          <h2>6. Vos droits</h2>
          <p>
            Conformément au Code du numérique, vous disposez d&apos;un droit d&apos;accès, de
            rectification, d&apos;effacement, d&apos;opposition et de limitation concernant vos
            données, ainsi que du droit de retirer votre consentement à tout moment.
          </p>
          <p>
            Pour exercer ces droits, écrivez-nous à{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> ou via notre{" "}
            <Link href="/contact">page de contact</Link>. Vous pouvez également introduire une
            réclamation auprès de l&apos;APDP.
          </p>

          <h2>7. Gérer votre consentement</h2>
          <p>
            Vous pouvez revenir sur votre choix concernant la mesure d&apos;audience à tout moment :
          </p>
        </div>

        <div className="mt-4">
          <CookiePreferencesButton />
        </div>
      </div>
    </section>
  );
}
