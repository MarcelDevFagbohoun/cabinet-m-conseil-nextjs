export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

export function formatPrice(price: number | string | null, unit = "FCFA") {
  if (price === null || price === undefined || price === "") return "Prix sur demande";
  const value = typeof price === "string" ? Number(price) : price;
  if (!Number.isFinite(value)) return "Prix sur demande";
  return `${new Intl.NumberFormat("fr-FR").format(value)} ${unit}`;
}

export function formatArea(area: number | string | null) {
  if (area === null || area === undefined || area === "") return null;
  const value = typeof area === "string" ? Number(area) : area;
  if (!Number.isFinite(value)) return null;
  return `${new Intl.NumberFormat("fr-FR").format(value)} m²`;
}

export function formatDate(date: Date | string | null) {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(d);
}

export const PROPERTY_TYPES = [
  { value: "parcelle", label: "Parcelle / terrain" },
  { value: "maison", label: "Maison / villa" },
  { value: "appartement", label: "Appartement" },
  { value: "immeuble", label: "Immeuble" },
  { value: "bureau", label: "Bureau / local" },
  { value: "autre", label: "Autre" },
] as const;

export const PROPERTY_STATUS = [
  { value: "disponible", label: "Disponible" },
  { value: "reserve", label: "Réservé" },
  { value: "vendu", label: "Vendu" },
  { value: "loue", label: "Loué" },
] as const;

export const DOC_TYPES = [
  { value: "titre_foncier", label: "Titre foncier" },
  { value: "plan", label: "Plan / levé topographique" },
  { value: "convention", label: "Convention de vente" },
  { value: "attestation", label: "Attestation" },
  { value: "autre", label: "Autre document" },
] as const;

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
