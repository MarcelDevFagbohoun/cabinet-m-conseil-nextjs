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
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 p-5 lg:flex-row lg:p-8">
      <aside className="lg:w-64 lg:shrink-0">
        <div className="card sticky top-6 p-5">
          <p className="font-display text-lg font-bold text-ink">
            Cabinet <em className="not-italic text-gold">M</em>
          </p>
          <p className="mt-1 text-xs text-ink-faint">Connecté : {userName}</p>

          <nav className="mt-6 space-y-1">
            {links.map((link) => {
              const active =
                link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-semibold transition",
                    active ? "bg-gold/10 text-gold" : "text-ink-dim hover:bg-bg-alt"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 space-y-2 border-t border-line pt-4">
            <Link href="/" target="_blank" className="block text-xs text-ink-faint hover:text-gold">
              Voir le site public ↗
            </Link>
            <button onClick={logout} className="text-xs font-bold text-wine hover:underline">
              Se déconnecter
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
