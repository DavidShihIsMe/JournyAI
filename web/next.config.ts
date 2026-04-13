import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Use Turbopack with empty config to silence the warning
  turbopack: {},

  // Silence lockfile detection warning by setting the tracing root
  outputFileTracingRoot: path.resolve(__dirname, ".."),

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@lib": path.resolve(__dirname, "../lib"),
    };
    return config;
  },
};

export default nextConfig;
