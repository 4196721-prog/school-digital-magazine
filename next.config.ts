import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qxfglnlgmeipfgluidth.supabase.co",
        pathname: "/storage/v1/object/public/magazine-covers/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
