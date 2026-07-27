"use client";

import Image from "next/image";
import { useState } from "react";
import { services, waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export default function ServiceTabs() {
  const [active, setActive] = useState(services[0].id);
  const current = services.find((s) => s.id === active) ?? services[0];

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {services.map((service) => (
          <button
            key={service.id}
            type="button"
            onClick={() => setActive(service.id)}
            aria-pressed={service.id === active}
            className={cn(
              "rounded-md border p-4 text-left transition duration-300",
              service.id === active
                ? "border-gold bg-raised shadow-card"
                : "border-line bg-raised-2 hover:border-line-strong"
            )}
          >
            <span className="block text-[11px] font-extrabold tracking-[0.2em] text-gold">
              {service.num}
            </span>
            <span className="mt-2 block font-display text-[15px] font-bold leading-snug text-ink">
              {service.title}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        </div>

        <div id={current.id}>
          <p className="eyebrow">Service {current.num}</p>
          <h2 className="text-3xl text-ink sm:text-[34px]">{current.title}</h2>
          {current.paragraphs.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-ink-dim">
              {p}
            </p>
          ))}
          <ul className="mt-6 space-y-3">
            {current.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-ink">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">
                  ✓
                </span>
                {point}
              </li>
            ))}
          </ul>
          <a
            href={waLink(current.wa)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold mt-8"
          >
            Contacter pour ce service sur WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
