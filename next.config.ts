import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/photos", destination: "/wallpapers", permanent: true }];
  },
  async headers() {
    return [{
      // The hero AVIF filenames contain a hash of their content.
      source: "/hero/:asset(bonsai-[0-9]+\\.[a-f0-9]{12}\\.avif)",
      headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
    }];
  },
};

export default nextConfig;
