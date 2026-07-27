export type Property = {
  id: number;
  slug: string;
  title: string;
  type: "parcelle" | "maison" | "appartement" | "immeuble" | "bureau" | "autre";
  transaction: "vente" | "location";
  status: "disponible" | "reserve" | "vendu" | "loue";
  price: string | null;
  price_unit: string;
  price_on_request: number;
  area_sqm: string | null;
  city: string | null;
  district: string | null;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  floors: number | null;
  year_built: number | null;
  amenities: string[] | null;
  excerpt: string | null;
  description: string | null;
  legal_notes: string | null;
  cover_image: string | null;
  is_published: number;
  is_featured: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type PropertyImage = {
  id: number;
  property_id: number;
  url: string;
  alt: string | null;
  position: number;
};

export type PropertyDocument = {
  id: number;
  property_id: number;
  label: string;
  doc_type: "titre_foncier" | "plan" | "convention" | "attestation" | "autre";
  url: string;
  is_public: number;
};

export type PropertyFull = Property & {
  images: PropertyImage[];
  documents: PropertyDocument[];
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  is_published: number;
  published_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  property_id: number | null;
  is_read: number;
  created_at: string;
};
