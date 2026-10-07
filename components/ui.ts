/** Shared control styles. Pill buttons, 44px+ touch targets, strong ease-out press. */
const base =
  "inline-flex items-center justify-center gap-2.5 rounded-full font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out-strong active:scale-[0.97]";

export const button = {
  ink: `${base} h-12 bg-ink px-6 text-[0.95rem] text-paper hover:bg-ink-2`,
  paper: `${base} h-12 bg-paper px-6 text-[0.95rem] text-ink hover:bg-floor`,
  whatsapp: `${base} h-12 bg-whatsapp px-6 text-[0.95rem] text-ink hover:bg-[#2ee072]`,
  outline: `${base} h-11 border border-ink/20 px-4 text-sm text-ink hover:border-ink`,
  outlineOnInk: `${base} h-11 border border-paper/25 px-4 text-sm text-paper hover:border-paper/70`,
};

export const container = "mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10";
