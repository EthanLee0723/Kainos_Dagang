import { ogCard, ogSize } from "@/lib/og";
import { getProduct } from "@/lib/products";

export const alt = "Kainos Dagang product";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return ogCard({});
  return ogCard({
    title: product.name.en,
    detail: [product.brand, product.code].filter(Boolean).join(" · "),
  });
}
