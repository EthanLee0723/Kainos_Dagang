import { hoursRows } from "@/lib/hours";
import en from "@/lib/i18n/dictionaries/en";
import { categories, getCategory, products } from "@/lib/products";
import { absoluteUrl } from "@/lib/seo";
import { branchAddress, branches, company } from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt (llmstxt.org): a plain-Markdown summary of the business and its
 * catalogue for AI assistants and answer engines, which otherwise have to
 * piece it together from the rendered pages.
 */
export function GET() {
  const shops = branches
    .map((b) => {
      const hours = hoursRows(b.hours, "en", en.hours)
        .map((row) => `  - ${row.label}: ${row.time}`)
        .join("\n");
      return `- **${b.name}**: ${branchAddress(b)}. Tel ${b.phoneDisplay}. Opening hours:\n${hours}`;
    })
    .join("\n");

  const catalogue = categories
    .map((c) => {
      const items = products
        .filter((p) => p.category === c.id)
        .map((p) => `- [${p.name.en} (${p.code})](${absoluteUrl(`/en/products/${p.slug}`)}): ${p.summary.en}`)
        .join("\n");
      return items ? `### ${getCategory(c.id).name.en}\n\n${items}` : "";
    })
    .filter(Boolean)
    .join("\n\n");

  const body = `# ${company.name}

> ${en.meta.description}

${company.legalName} (${company.registration}) sells safety shoes, safety boots, kitchen footwear, safety helmets and reflective vests in Selangor, Malaysia. Customers try products on in store with staff help on size and safety rating, or enquire on WhatsApp. Prices are not published online: every price, retail or bulk, is quoted on WhatsApp.

- Website languages: [English](${absoluteUrl("/en")}), [Bahasa Melayu](${absoluteUrl("/ms")}), [简体中文](${absoluteUrl("/zh")})
- WhatsApp (main line): ${company.phoneDisplay}, https://wa.me/${company.whatsappNumber}
- Email: ${company.email}

## Shops

${shops}

## Pages

- [Home](${absoluteUrl("/en")})
- [All products](${absoluteUrl("/en/products")})

## Products

${catalogue}
`;

  return new Response(body, { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
