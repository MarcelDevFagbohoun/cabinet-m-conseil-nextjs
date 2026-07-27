"use client";

import Image from "next/image";
import { useState } from "react";
import type { PropertyImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function Gallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  const current = images[Math.min(active, images.length - 1)];

  return (
    <div>
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-bg-alt">
        <Image
          src={current.url}
          alt={current.alt || title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-6">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Photo ${index + 1}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border-2 transition",
                index === active ? "border-gold" : "border-transparent opacity-75 hover:opacity-100"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt || `${title} — photo ${index + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
