import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Shows which commit is live in the footer, so you can tell when Vercel has picked up a change.
  env: { NEXT_PUBLIC_BUILD: (process.env.VERCEL_GIT_COMMIT_SHA ?? "local").slice(0, 7) },
};

export default nextConfig;
