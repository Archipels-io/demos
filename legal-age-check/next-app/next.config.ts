import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/legal-age-check",
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'connect-prod.s3.fr-par.scw.cloud',
        port: '',
        pathname: '/logo/**',
      },
    ],
  },
};

export default nextConfig;
