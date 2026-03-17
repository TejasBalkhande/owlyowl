import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Force Next.js to bundle these instead of treating them as external
  transpilePackages: ["drizzle-orm", "@libsql/client"],
  
  // 2. THE FIX: Tell Turbopack (Next.js 16 default) to use the Edge-safe version
  turbopack: {
    resolveAlias: {
      "@libsql/client$": "@libsql/client/web",
      "@libsql/client": "@libsql/client/web",
    },
  },

  // 3. Webpack fallback (Required because OpenNext still uses Webpack under the hood)
  webpack: (config) => {
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    
    // Forces ANY import of @libsql/client to use the Cloudflare-safe /web version
    config.resolve.alias["@libsql/client$"] = "@libsql/client/web";
    config.resolve.alias["@libsql/client"] = "@libsql/client/web";
    
    return config;
  },
};

export default nextConfig;