"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Clarity from "./Clarity";

const STORAGE_KEY = "cmc-consent-mesure-audience";
type Choice = "granted" | "denied";

function read(): Choice | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Rouvre la bannière (appelé depuis la page Confidentialité). */
export function reopenConsent() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event("cmc-consent-reopen"));
}

export default function CookieConsent() {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(read());
    setReady(true);
    const onReopen = () => setChoice(null);
    window.addEventListener("cmc-consent-reopen", onReopen);
    return () => window.removeEventListener("cmc-consent-reopen", onReopen);
  }, []);

  function decide(next: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    setChoice(next);
  }

  return (
    <>
      {choice === "granted" && <Clarity />}

      {ready && choice === null && (
        <div
          role="dialog"
          aria-label="Consentement à la mesure d'audience"
          className="fixed inset-x-0 bottom-0 z-[100] border-t border-line bg-raised p-4 shadow-raise sm:p-5"
        >
          <div className="container-x flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-relaxed text-ink-dim">
              Nous utilisons un outil de mesure d&apos;audience (Microsoft Clarity) pour comprendre
              l&apos;usage du site et l&apos;améliorer. Il n&apos;est activé qu&apos;avec votre
              accord.{" "}
              <Link href="/confidentialite" className="font-semibold text-gold underline underline-offset-2">
                En savoir plus
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button onClick={() => decide("denied")} className="btn-ghost !py-2 text-sm">
                Refuser
              </button>
              <button onClick={() => decide("granted")} className="btn-gold !py-2 text-sm">
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
