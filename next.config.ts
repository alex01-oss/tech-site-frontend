import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'nginx', 'pdtools.shop'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: "localhost",
        port: "8080",
        pathname: "/images/**",
      },
      {
        protocol: 'http',
        hostname: "nginx",
        pathname: "/images/**",
      },
      {
        protocol: 'https',
        hostname: "pdtools.shop",
        pathname: "/images/**",
      }
    ],
    unoptimized: true
  }
};

export default nextConfig;