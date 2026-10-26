"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Section tabs under the admin header; the current section is underlined in orange. */
export function AdminNav({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const isCurrent = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav aria-label={label} className="border-t border-ink-line">
      <ul className="mx-auto flex max-w-7xl snap-x gap-1 overflow-x-auto px-2 [scrollbar-width:none] sm:px-4">
        {items.map((item) => (
          <li key={item.href} className="shrink-0 snap-start">
            <Link
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className="relative inline-flex h-12 items-center px-3 text-sm font-medium whitespace-nowrap text-paper/65 transition-colors hover:text-paper aria-[current=page]:text-paper after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-orange after:opacity-0 aria-[current=page]:after:opacity-100"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
