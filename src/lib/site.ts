export const site = {
  name: "Cabinet M Conseils",
  tagline: "Conseils juridiques & immobilier",
  description:
    "Cabinet M Conseils : plus de 13 ans d'expérience en rédaction de contrats, recouvrement de créances, conseil juridique et gestion de biens immobiliers à Cotonou et partout au Bénin.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.cabinetmconseils.com",
  whatsapp: "2290195380006",
  whatsappDisplay: "+229 01 95 38 00 06",
  phone: "01 69 58 81 81",
  city: "Cotonou, République du Bénin",
  linkedin: "https://www.linkedin.com/",
  facebook: "https://www.facebook.com/",
};

export function waLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}

export const nav = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/biens-immobiliers", label: "Biens immobiliers" },
  { href: "/blog", label: "Blog" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export const services = [
  {
    id: "redaction",
    num: "01",
    title: "Rédaction de contrats et actes juridiques",
    short:
      "Un contrat mal rédigé coûte toujours plus cher qu'un contrat bien pensé. Nous rédigeons vos contrats, baux, statuts et actes sur mesure, en anticipant les risques avant qu'ils ne deviennent des litiges.",
    paragraphs: [
      "Un contrat mal rédigé coûte toujours plus cher qu'un contrat bien pensé. Nous rédigeons vos contrats commerciaux, baux, statuts, conventions et actes juridiques sur mesure, en anticipant les risques avant qu'ils ne deviennent des litiges.",
      "Chaque clause est pesée, chaque engagement sécurisé — pour que le document que vous signez vous protège réellement.",
    ],
    points: [
      "Contrats commerciaux et conventions sur mesure",
      "Baux, statuts de société, actes divers",
      "Relecture et sécurisation de documents existants",
    ],
    image:
      "https://images.unsplash.com/photo-1758518731462-d091b0b4ed0d?q=80&w=1200&auto=format&fit=crop",
    wa: "Bonjour Cabinet M Conseils, je souhaite être accompagné(e) pour la rédaction d'un contrat / acte juridique. Pouvez-vous m'en dire plus ?",
  },
  {
    id: "recouvrement",
    num: "02",
    title: "Recouvrement des créances",
    short:
      "Un impayé est aussi une question de relation. Nous privilégions d'abord le dialogue et la négociation amiable, et n'engageons la voie judiciaire que si nécessaire — avec fermeté et diplomatie.",
    paragraphs: [
      "Un impayé n'est jamais qu'une question d'argent, c'est aussi une question de relation. Nous privilégions d'abord le dialogue et la négociation amiable, et n'engageons la voie judiciaire que lorsque c'est nécessaire.",
      "Notre objectif : recouvrer ce qui vous est dû sans rompre inutilement ce qui peut encore l'être.",
    ],
    points: [
      "Relances et négociation amiable",
      "Mise en demeure et procédures judiciaires si nécessaire",
      "Suivi rigoureux jusqu'au règlement du dossier",
    ],
    image:
      "https://images.unsplash.com/photo-1710492341412-8b3aee7e70a6?q=80&w=1200&auto=format&fit=crop",
    wa: "Bonjour Cabinet M Conseils, j'ai besoin d'aide pour le recouvrement d'une créance. Pouvez-vous m'accompagner ?",
  },
  {
    id: "conseil",
    num: "03",
    title: "Conseil et assistance juridiques",
    short:
      "Avant de décider, il faut comprendre. Nous vous accompagnons en amont de vos démarches avec des réponses claires, sans jargon inutile, pour que chaque décision soit prise en toute confiance.",
    paragraphs: [
      "Avant de décider, il faut comprendre. Nous vous accompagnons en amont de vos démarches — création d'entreprise, litiges, questions du quotidien — avec des réponses claires, sans jargon inutile.",
      "Pour que chaque décision que vous prenez soit prise en toute confiance.",
    ],
    points: [
      "Consultations et avis juridiques personnalisés",
      "Accompagnement à la création d'entreprise",
      "Assistance en cas de litige",
    ],
    image:
      "https://images.unsplash.com/photo-1459499362902-55a20553e082?q=80&w=1200&auto=format&fit=crop",
    wa: "Bonjour Cabinet M Conseils, je souhaite un conseil et une assistance juridique. Pouvez-vous m'accompagner ?",
  },
  {
    id: "immobilier",
    num: "04",
    title: "Vente, achat et gestion de biens immobiliers",
    short:
      "Un bien immobilier engage souvent toute une vie d'économies. Nous vous accompagnons à chaque étape — vérifications, négociation, actes, gestion locative — avec la rigueur que mérite un tel projet.",
    paragraphs: [
      "Un bien immobilier engage souvent toute une vie d'économies. Nous vérifions les titres, sécurisons la négociation, rédigeons les actes et assurons la gestion locative de vos biens.",
      "Chaque bien que nous présentons a d'abord été vérifié par nos équipes : titre foncier, bornage, absence de litige.",
    ],
    points: [
      "Vérification juridique complète du bien",
      "Rédaction et sécurisation des actes de vente",
      "Gestion locative et suivi transparent",
    ],
    image:
      "https://images.unsplash.com/photo-1735547876935-7be80eae1c88?q=80&w=1200&auto=format&fit=crop",
    wa: "Bonjour Cabinet M Conseils, j'ai un projet de vente/achat ou de gestion d'un bien immobilier. Pouvez-vous m'accompagner ?",
  },
  {
    id: "informations",
    num: "05",
    title: "Informations juridiques",
    short:
      "Le droit évolue sans cesse. Nous assurons une veille régulière et partageons les informations juridiques utiles à votre situation, dans un langage clair et accessible.",
    paragraphs: [
      "Le droit évolue sans cesse. Nous assurons une veille régulière et partageons avec vous les informations juridiques utiles à votre situation, dans un langage clair et accessible.",
      "Pour que vous ne soyez jamais pris(e) au dépourvu.",
    ],
    points: [
      "Veille juridique régulière",
      "Notes d'information claires et accessibles",
      "Alertes sur les évolutions qui vous concernent",
    ],
    image:
      "https://images.unsplash.com/photo-1666867540898-aaa1993ffabc?q=80&w=1200&auto=format&fit=crop",
    wa: "Bonjour Cabinet M Conseils, je souhaite recevoir des informations juridiques utiles à ma situation.",
  },
];
