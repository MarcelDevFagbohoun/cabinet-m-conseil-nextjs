"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Tableau de bord" },
  { href: "/admin/biens", label: "Biens immobiliers" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/messages", label: "Messages" },
];

export default function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4 sm:p-6 lg:flex lg:gap-6 lg:p-8">
      <aside className="lg:w-60 lg:shrink-0">
        <div className="card p-4 lg:sticky lg:top-6 lg:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-lg font-bold text-ink">
                Cabinet <em className="not-italic text-gold">M</em>
              </p>
              <p className="mt-0.5 truncate text-xs text-ink-faint">Connecté : {userName}</p>
            </div>
            <button
              onClick={logout}
              className="shrink-0 text-xs font-bold text-wine hover:underline lg:hidden"
            >
              Déconnexion
            </button>
          </div>

          <nav className="mt-4 flex gap-1 overflow-x-auto lg:mt-6 lg:flex-col lg:overflow-visible">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-gold/10 text-gold" : "text-ink-dim hover:bg-bg-alt"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 hidden space-y-2 border-t border-line pt-4 lg:block">
            <Link href="/" target="_blank" className="block text-xs text-ink-faint hover:text-gold">
              Voir le site public ↗
            </Link>
            <button onClick={logout} className="text-xs font-bold text-wine hover:underline">
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      <main className="mt-4 min-w-0 flex-1 lg:mt-0">{children}</main>
    </div>
  );
}
