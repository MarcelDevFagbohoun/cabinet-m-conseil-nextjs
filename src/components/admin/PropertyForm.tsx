"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Uploader from "./Uploader";
import type { PropertyFull } from "@/lib/types";
import { DOC_TYPES, PROPERTY_STATUS, PROPERTY_TYPES } from "@/lib/utils";

type ImageItem = { url: string; alt: string };
type DocItem = { label: string; doc_type: string; url: string; is_public: boolean };

export default function PropertyForm({ property }: { property?: PropertyFull }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cover, setCover] = useState(property?.cover_image ?? "");
  const [images, setImages] = useState<ImageItem[]>(
    property?.images.map((i) => ({ url: i.url, alt: i.alt ?? "" })) ?? []
  );
  const [documents, setDocuments] = useState<DocItem[]>(
    property?.documents.map((d) => ({
      label: d.label,
      doc_type: d.doc_type,
      url: d.url,
      is_public: Boolean(d.is_public),
    })) ?? []
  );
  const [amenities, setAmenities] = useState((property?.amenities ?? []).join(", "));

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = {
      title: form.get("title"),
      slug: form.get("slug"),
      type: form.get("type"),
      transaction: form.get("transaction"),
      status: form.get("status"),
      price: form.get("price"),
      price_unit: form.get("price_unit") || "FCFA",
      price_on_request: form.get("price_on_request") === "on",
      area_sqm: form.get("area_sqm"),
      city: form.get("city"),
      district: form.get("district"),
      address: form.get("address"),
      bedrooms: form.get("bedrooms"),
      bathrooms: form.get("bathrooms"),
      floors: form.get("floors"),
      year_built: form.get("year_built"),
      amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
      excerpt: form.get("excerpt"),
      description: form.get("description") ?? "",
      legal_notes: form.get("legal_notes"),
      cover_image: cover || images[0]?.url || null,
      is_published: form.get("is_published") === "on",
      is_featured: form.get("is_featured") === "on",
      meta_title: form.get("meta_title"),
      meta_description: form.get("meta_description"),
      images,
      documents,
    };

    const response = await fetch(
      property ? `/api/admin/properties/${property.id}` : "/api/admin/properties",
      {
        method: property ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await response.json().catch(() => ({}));
    setSaving(false);

    if (!response.ok) {
      setError(data.error || "Enregistrement impossible.");
      return;
    }
    router.push("/admin/biens");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <p className="rounded-md border border-wine/30 bg-wine/5 p-3 text-sm font-semibold text-wine">
          {error}
        </p>
      )}

      {/* Informations principales */}
      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Informations principales</h2>

        <div>
          <label className="field-label" htmlFor="title">Titre du bien *</label>
          <input id="title" name="title" required defaultValue={property?.title} className="field" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue={property?.type ?? "parcelle"} className="field">
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="transaction">Transaction</label>
            <select id="transaction" name="transaction" defaultValue={property?.transaction ?? "vente"} className="field">
              <option value="vente">À vendre</option>
              <option value="location">À louer</option>
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="status">Statut</label>
            <select id="status" name="status" defaultValue={property?.status ?? "disponible"} className="field">
              {PROPERTY_STATUS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="price">Prix</label>
            <input id="price" name="price" type="number" step="1000" defaultValue={property?.price ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="price_unit">Devise</label>
            <input id="price_unit" name="price_unit" defaultValue={property?.price_unit ?? "FCFA"} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="area_sqm">Superficie (m²)</label>
            <input id="area_sqm" name="area_sqm" type="number" step="0.01" defaultValue={property?.area_sqm ?? ""} className="field" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink">
          <input type="checkbox" name="price_on_request" defaultChecked={Boolean(property?.price_on_request)} />
          Afficher « Prix sur demande »
        </label>
      </section>

      {/* Localisation */}
      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Localisation</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="field-label" htmlFor="city">Ville</label>
            <input id="city" name="city" defaultValue={property?.city ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="district">Quartier</label>
            <input id="district" name="district" defaultValue={property?.district ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="address">Adresse / repère</label>
            <input id="address" name="address" defaultValue={property?.address ?? ""} className="field" />
          </div>
        </div>
      </section>

      {/* Détails maison */}
      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Détails du bâti (maisons / appartements)</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="field-label" htmlFor="bedrooms">Chambres</label>
            <input id="bedrooms" name="bedrooms" type="number" min="0" defaultValue={property?.bedrooms ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="bathrooms">Salles d&apos;eau</label>
            <input id="bathrooms" name="bathrooms" type="number" min="0" defaultValue={property?.bathrooms ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="floors">Niveaux</label>
            <input id="floors" name="floors" type="number" min="0" defaultValue={property?.floors ?? ""} className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="year_built">Année</label>
            <input id="year_built" name="year_built" type="number" min="1900" max="2100" defaultValue={property?.year_built ?? ""} className="field" />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="amenities">Équipements (séparés par des virgules)</label>
          <input
            id="amenities"
            value={amenities}
            onChange={(e) => setAmenities(e.target.value)}
            placeholder="Forage, Garage, Clôturée"
            className="field"
          />
        </div>
      </section>

      {/* Contenu */}
      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Description</h2>
        <div>
          <label className="field-label" htmlFor="excerpt">Résumé court (liste)</label>
          <input id="excerpt" name="excerpt" maxLength={320} defaultValue={property?.excerpt ?? ""} className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="description">Description complète</label>
          <textarea id="description" name="description" rows={8} defaultValue={property?.description ?? ""} className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="legal_notes">Note juridique du cabinet</label>
          <textarea id="legal_notes" name="legal_notes" rows={4} defaultValue={property?.legal_notes ?? ""} className="field" />
        </div>
      </section>

      {/* Photos */}
      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg text-ink">Photos</h2>
          <Uploader label="+ Ajouter des photos" onUploaded={(url) => setImages((prev) => [...prev, { url, alt: "" }])} />
        </div>

        {images.length === 0 && <p className="text-sm text-ink-faint">Aucune photo pour le moment.</p>}

        <div className="grid gap-4 sm:grid-cols-3">
          {images.map((image, index) => (
            <div key={`${image.url}-${index}`} className="rounded-md border border-line p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-bg-alt">
                <Image src={image.url} alt={image.alt || "Photo"} fill sizes="200px" className="object-cover" />
              </div>
              <input
                value={image.alt}
                onChange={(e) =>
                  setImages((prev) =>
                    prev.map((item, i) => (i === index ? { ...item, alt: e.target.value } : item))
                  )
                }
                placeholder="Texte alternatif (SEO)"
                className="field mt-2 text-xs"
              />
              <div className="mt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setCover(image.url)}
                  className={cover === image.url ? "font-bold text-gold" : "text-ink-dim hover:text-gold"}
                >
                  {cover === image.url ? "Photo principale" : "Définir principale"}
                </button>
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}
                  className="font-bold text-wine"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="card space-y-4 p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg text-ink">Documents (titre foncier, plan, PDF)</h2>
          <Uploader
            label="+ Ajouter un document"
            accept="application/pdf,image/jpeg,image/png"
            onUploaded={(url) =>
              setDocuments((prev) => [...prev, { label: "Document", doc_type: "autre", url, is_public: false }])
            }
          />
        </div>

        {documents.length === 0 && <p className="text-sm text-ink-faint">Aucun document.</p>}

        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div key={`${doc.url}-${index}`} className="grid gap-3 rounded-md border border-line p-3 sm:grid-cols-[1.2fr_1fr_auto_auto]">
              <input
                value={doc.label}
                onChange={(e) =>
                  setDocuments((prev) => prev.map((d, i) => (i === index ? { ...d, label: e.target.value } : d)))
                }
                placeholder="Intitulé"
                className="field text-sm"
              />
              <select
                value={doc.doc_type}
                onChange={(e) =>
                  setDocuments((prev) => prev.map((d, i) => (i === index ? { ...d, doc_type: e.target.value } : d)))
                }
                className="field text-sm"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <label className="flex items-center gap-2 text-xs text-ink">
                <input
                  type="checkbox"
                  checked={doc.is_public}
                  onChange={(e) =>
                    setDocuments((prev) =>
                      prev.map((d, i) => (i === index ? { ...d, is_public: e.target.checked } : d))
                    )
                  }
                />
                Visible publiquement
              </label>
              <button
                type="button"
                onClick={() => setDocuments((prev) => prev.filter((_, i) => i !== index))}
                className="text-xs font-bold text-wine"
              >
                Supprimer
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SEO + publication */}
      <section className="card space-y-4 p-6">
        <h2 className="text-lg text-ink">Référencement et publication</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="slug">Slug (URL)</label>
            <input id="slug" name="slug" defaultValue={property?.slug ?? ""} placeholder="généré automatiquement" className="field" />
          </div>
          <div>
            <label className="field-label" htmlFor="meta_title">Titre SEO</label>
            <input id="meta_title" name="meta_title" maxLength={190} defaultValue={property?.meta_title ?? ""} className="field" />
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="meta_description">Description SEO (160 caractères)</label>
          <input id="meta_description" name="meta_description" maxLength={320} defaultValue={property?.meta_description ?? ""} className="field" />
        </div>
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_published" defaultChecked={Boolean(property?.is_published)} />
            Publier sur le site
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="checkbox" name="is_featured" defaultChecked={Boolean(property?.is_featured)} />
            Mettre à la une
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-gold disabled:opacity-60">
          {saving ? "Enregistrement…" : property ? "Mettre à jour le bien" : "Créer le bien"}
        </button>
        <button type="button" onClick={() => router.push("/admin/biens")} className="btn-ghost">
          Annuler
        </button>
      </div>
    </form>
  );
}
