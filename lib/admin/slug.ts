/** "BH 0993/2-SP" → "bh-0993-2-sp": lowercase letters, numbers and dashes. */
export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** `base`, or `base-2`, `base-3`… whichever isn't taken. */
export function uniqueSlug(base: string, taken: Set<string>) {
  const root = base || "item";
  if (!taken.has(root)) return root;
  let n = 2;
  while (taken.has(`${root}-${n}`)) n++;
  return `${root}-${n}`;
}
