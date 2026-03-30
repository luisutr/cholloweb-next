import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // CDN principal de imágenes de Amazon (PA-API)
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        // Imágenes de producto Amazon por ASIN (sin API)
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
      {
        // CDN europeo de Amazon
        protocol: "https",
        hostname: "images-eu.ssl-images-amazon.com",
      },
    ],
  },
};

export default nextConfig;
