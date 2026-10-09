import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the project root: a stray package-lock.json in the home folder otherwise confuses root detection.
  // Product photos are upscaled catalogue shots; a higher quality keeps their detail.
  images: { qualities: [75, 85] },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
