import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  transpilePackages: [],
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
