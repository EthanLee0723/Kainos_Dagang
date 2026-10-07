"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The site's origin, so WhatsApp messages can carry an absolute product link.
 * On the server it falls back to NEXT_PUBLIC_SITE_URL (empty when unset).
 */
export function useOrigin() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.origin,
    () => process.env.NEXT_PUBLIC_SITE_URL ?? "",
  );
}
