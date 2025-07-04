import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true,
  },
  // Remove static export for now since we have API routes
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
