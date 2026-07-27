"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-line bg-bg/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="container-x flex h-[74px] items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Cabinet M Conseils"
            width={44}
            height={44}
            className="h-11 w-11 object-contain"
            priority
          />
          <span className="leading-tight">
            <span className="block font-display text-[17px] font-bold text-ink">
              Cabinet <em className="not-italic text-gold">M</em> Conseils
            </span>
            <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {site.tagline}
            </span>
          </span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-semibold transition",
                  active ? "bg-bg-alt text-gold" : "text-ink-dim hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={waLink("Bonjour Cabinet M Conseils, je souhaite obtenir des renseignements.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold hidden !px-5 !py-2.5 sm:inline-flex"
          >
            WhatsApp
          </a>
          <button
            type="button"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line-strong lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
              <span className="block h-0.5 w-5 bg-ink" />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-bg lg:hidden">
          <nav className="container-x flex flex-col py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-line/60 py-3 text-sm font-semibold text-ink-dim"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={waLink("Bonjour Cabinet M Conseils, je souhaite obtenir des renseignements.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-4"
            >
              Écrire sur WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}