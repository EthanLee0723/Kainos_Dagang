"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/lib/products";
import { codeTag, photoClass } from "./photo-class";

type Props = {
  images: string[];
  /** Fit of the main photo; other angles and spec sheets are always shown whole. */
  fit: Product["imageFit"];
  code: string;
  alt: string;
  labels: { show: string };
};

/** The main photo plus a row of thumbnails for other angles and colourways. */
export function ProductGallery({ images, fit, code, alt, labels }: Props) {
  const [active, setActive] = useState(0);
  const mainFit = active === 0 ? fit : "contain";

  return (
    <div>
      <div className="relative aspect-square overflow-hidden border border-line bg-floor">
        <Image
          key={images[active]}
          src={images[active]}
          alt={alt}
          fill
          priority={active === 0}
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={85}
          className={photoClass(mainFit)}
        />
        <span className={`${codeTag} top-3.5 left-3.5 text-sm`}>{code}</span>
      </div>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                aria-pressed={active === i}
                aria-label={labels.show.replace("{n}", String(i + 1))}
                onClick={() => setActive(i)}
                className={`relative block aspect-square w-full overflow-hidden border bg-floor transition-colors duration-150 ${
                  active === i ? "border-ink" : "border-line hover:border-ink/50"
                }`}
              >
                <Image src={src} alt="" fill sizes="96px" className={photoClass(i === 0 ? fit : "contain", { tagged: false })} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
