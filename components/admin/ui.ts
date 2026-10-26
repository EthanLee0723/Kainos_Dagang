/** Shared admin control styles, on the site's tokens. */
export const input =
  "block w-full rounded-md border border-line bg-paper px-3 py-2.5 text-[0.95rem] text-ink placeholder:text-muted/70 transition-colors hover:border-ink/40 focus:border-ink focus:outline-none aria-[invalid=true]:border-orange";

export const label = "block text-sm font-semibold";
export const hint = "mt-1 text-[0.82rem] leading-snug text-muted";
export const errorText = "mt-1.5 text-[0.82rem] font-medium text-[#c23a00]";

const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 ease-out-strong active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

export const adminButton = {
  primary: `${btn} bg-ink text-paper hover:bg-ink-2`,
  secondary: `${btn} border border-ink/20 bg-paper text-ink hover:border-ink`,
  danger: `${btn} border border-[#c23a00]/40 bg-paper text-[#c23a00] hover:border-[#c23a00] hover:bg-[#c23a00]/5`,
  dangerSolid: `${btn} bg-[#c23a00] text-paper hover:bg-[#a83200]`,
  quiet: `${btn} px-3 text-ink hover:bg-floor-2`,
};

export const card = "rounded-lg border border-line bg-paper";
export const sectionTitle = "font-display text-[1.05rem] uppercase";
