"use client";

import { reopenConsent } from "./CookieConsent";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={reopenConsent}
      className="btn-ghost !py-2 text-sm"
    >
      Modifier mon choix sur la mesure d&apos;audience
    </button>
  );
}
