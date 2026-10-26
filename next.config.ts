import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product photos are upscaled catalogue shots; a higher quality keeps their detail.
  images: {
    qualities: [75, 85],
    // Photos uploaded in the admin when Vercel Blob storage is configured (lib/admin/storage.ts).
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com", pathname: "/products/**" }],
  },
  // Pin the project root: a stray package-lock.json in the home folder otherwise confuses root detection.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
