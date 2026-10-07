import { ogCard, ogSize } from "@/lib/og";

export const alt = "Kainos Dagang: Melindungi Setiap Langkah";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image() {
  return ogCard({});
}
