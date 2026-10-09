"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { LanguageSwitcher } from "./language-switcher";
import { WhatsAppIcon } from "./whatsapp-icon";

type Props = {
  locale: Locale;
  items: { href: string; label: string }[];
  labels: { menu: string; close: string; language: string; whatsapp: string };
  whatsappHref: string;
};

/** Full-screen menu on phones and tablets. A native <dialog> handles focus and Escape. */
export function MobileNav({ locale, items, labels, whatsappHref }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
        className="inline-flex size-11 items-center justify-center text-paper lg:hidden"
      >
        <Menu className="size-6" strokeWidth={2.25} aria-hidden />
        <span className="sr-only">{labels.menu}</span>
      </button>

      <dialog
        ref={dialog}
        aria-label={labels.menu}
        className="menu-sheet m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-paper backdrop:bg-ink/60 open:flex open:flex-col"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6">
          <LanguageSwitcher current={locale} label={labels.language} className="text-paper" />
          <button
            type="button"
            onClick={close}
            className="inline-flex size-11 items-center justify-center"
            autoFocus
          >
            <X className="size-6" strokeWidth={2.25} aria-hidden />
            <span className="sr-only">{labels.close}</span>
          </button>
        </div>
        <div className="hazard h-2 bg-orange [--hazard-h:16px]" aria-hidden />
        <nav className="flex-1 overflow-y-auto px-4 pt-6 sm:px-6">
          <ul>
            {items.map((item, i) => (
              <li
                key={item.href}
                className="menu-item border-b border-ink-line"
                style={{ "--i": i } as React.CSSProperties}
              >
                <Link
                  href={item.href}
                  onClick={close}
                  className="font-display flex h-16 items-center text-2xl uppercase"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-item p-4 sm:p-6" style={{ "--i": items.length } as React.CSSProperties}>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener"
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-whatsapp text-base font-semibold text-ink"
          >
            <WhatsAppIcon className="size-6" />
            {labels.whatsapp}
          </a>
        </div>
      </dialog>
    </>
  );
}
