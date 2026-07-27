"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    const data = await response.json().catch(() => ({}));
    setLoading(false);

    if (!response.ok) {
      setError(data.error || "Connexion impossible.");
      return;
    }
    router.replace(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4 p-8">
      <div>
        <p className="eyebrow">Espace administrateur</p>
        <h1 className="text-2xl text-ink">Cabinet M Conseils</h1>
      </div>

      <div>
        <label className="field-label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label className="field-label" htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field"
        />
      </div>

      {error && <p className="text-sm font-semibold text-wine">{error}</p>}

      <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
        {loading ? "Connexion…" : "Se connecter"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg-alt px-5">
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
