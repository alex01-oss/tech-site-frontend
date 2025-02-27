import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['pdtools.shop']
  }
};

export default nextConfig;
