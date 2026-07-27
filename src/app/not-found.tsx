import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-gold">404</p>
        <h1 className="mt-4 text-2xl text-ink">Cette page n&apos;existe pas</h1>
        <p className="mt-2 text-sm text-ink-dim">
          Le lien est peut-être obsolète ou le bien a été retiré.
        </p>
        <Link href="/" className="btn-gold mt-6">Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
