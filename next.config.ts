import type { NextConfig } from "next";
import withSerwist from "@serwist/next";

const withPWA = withSerwist({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  // Disable service worker in dev to avoid caching issues during development
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  // Empty turbopack config tells Next.js 16 to use Turbopack in dev
  // without conflicting with serwist's webpack config (which is dev-disabled anyway)
  turbopack: {},
};

export default withPWA(nextConfig);
