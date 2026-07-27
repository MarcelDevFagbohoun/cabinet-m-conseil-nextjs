"use client";

import { useState } from "react";

export default function ContactForm({
  propertyId,
  defaultSubject,
}: {
  propertyId?: number;
  defaultSubject?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, property_id: propertyId ?? null }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Envoi impossible.");
      setStatus("sent");
      event.currentTarget.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Envoi impossible.");
    }
  }

  if (status === "sent") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-xl text-ink">Message bien reçu</p>
        <p className="mt-2 text-sm text-ink-dim">
          Notre équipe vous répond dans les meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-6 sm:p-8" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Nom complet *</label>
          <input id="name" name="name" required maxLength={120} className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" required maxLength={190} className="field" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="phone">Téléphone</label>
          <input id="phone" name="phone" maxLength={40} className="field" />
        </div>
        <div>
          <label className="field-label" htmlFor="subject">Objet</label>
          <input
            id="subject"
            name="subject"
            maxLength={190}
            defaultValue={defaultSubject}
            className="field"
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="message">Votre message *</label>
        <textarea id="message" name="message" required rows={6} maxLength={4000} className="field" />
      </div>

      {error && <p className="text-sm font-semibold text-wine">{error}</p>}

      <button type="submit" disabled={status === "sending"} className="btn-gold w-full disabled:opacity-60">
        {status === "sending" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
      <p className="text-xs text-ink-faint">
        Vos informations sont utilisées uniquement pour traiter votre demande.
      </p>
    </form>
  );
}
