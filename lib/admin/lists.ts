/** The catalogue lists edited with the shared list editor; also their admin URL segment. */
export const listKinds = ["categories", "brands", "colours", "sizes", "suitable-for", "tags"] as const;
export type ListKind = (typeof listKinds)[number];
