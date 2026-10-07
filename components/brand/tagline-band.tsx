import type { Dictionary } from "@/lib/i18n/dictionaries/en";

/**
 * Three black bars leaning 13.3°, measured from the guideline's tagline band.
 * `slice` keeps the bars' proportions and crops the group on narrow screens.
 */
function StripeGroup({ side, className }: { side: "left" | "right"; className?: string }) {
  return (
    <svg
      viewBox="0 0 356 181"
      preserveAspectRatio={side === "left" ? "xMinYMid slice" : "xMaxYMid slice"}
      className={className}
      aria-hidden
    >
      {[0, 128, 253].map((x) => (
        <path key={x} d={`M${x} 0h60l42.5 181h-60z`} fill="currentColor" />
      ))}
    </svg>
  );
}

/**
 * The orange "MELINDUNGI SETIAP LANGKAH" band from the signboard, in the
 * visitor's language. The Malay line (the longest) is 22.1em wide in Moderniz,
 * so its size is derived from the room left between the two stripe groups at
 * each breakpoint.
 */
export function TaglineBand({ dict, className = "" }: { dict: Dictionary; className?: string }) {
  const group = "absolute inset-y-0 h-full w-10 sm:w-[7.875rem] lg:w-[8.85rem]";
  return (
    <div
      className={`on-orange relative flex h-12 items-center justify-center overflow-hidden bg-orange text-ink sm:h-16 lg:h-[4.5rem] ${className}`}
    >
      <StripeGroup side="left" className={`${group} left-0`} />
      <p
        className="font-display text-center text-[min(0.95rem,calc((100vw-6.5rem)/22.6))] leading-none whitespace-nowrap sm:text-[min(1.3rem,calc((100vw-18rem)/22.6))] lg:text-[min(1.55rem,calc((100vw-20rem)/22.6))]"
      >
        {dict.tagline.toUpperCase()}
      </p>
      <StripeGroup side="right" className={`${group} right-0`} />
    </div>
  );
}
