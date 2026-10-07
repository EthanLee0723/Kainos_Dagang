import type { Locale } from "@/lib/i18n/config";
import { company } from "@/lib/site";
import { generalEnquiryUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./whatsapp-icon";

/** Always-visible WhatsApp button, bottom-right on every page. */
export function WhatsAppFloat({ locale, label }: { locale: Locale; label: string }) {
  return (
    <a
      href={generalEnquiryUrl(locale)}
      target="_blank"
      rel="noopener"
      aria-label={label}
      className="group fixed right-4 bottom-4 z-50 flex items-center gap-3 sm:right-6 sm:bottom-6"
    >
      <span className="hidden rounded-full bg-ink py-2.5 pr-4 pl-4 text-sm font-medium text-paper shadow-[0_8px_24px_-8px_rgb(0_0_0/0.5)] transition-[transform,opacity] duration-200 ease-out-strong md:block md:translate-x-2 md:opacity-0 md:group-hover:translate-x-0 md:group-hover:opacity-100 md:group-focus-visible:translate-x-0 md:group-focus-visible:opacity-100">
        <span className="tabular">{company.phoneDisplay}</span>
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-whatsapp text-paper shadow-[0_10px_28px_-6px_rgb(0_0_0/0.45)] transition-transform duration-150 ease-out-strong group-active:scale-[0.96] sm:size-16">
        <WhatsAppIcon className="size-7 sm:size-8" />
      </span>
    </a>
  );
}
