import path from "node:path";
import url from "node:url";
import react from "@astrojs/react";
import { defineConfig, envField } from "astro/config";
import tailwind from "@astrojs/tailwind";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import db from "@astrojs/db";
import node from "@astrojs/node";
import { access } from "node:fs";
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  prefetch: true,
  security: {
    checkOrigin: true,
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    db(),
  ],
  vite: {
    plugins: [
      TanStackRouterVite({
        routesDirectory: "./src/app/routes",
        generatedRouteTree: "./src/app/routeTree.gen.ts",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  },
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  experimental: {
    actions: true,
    env: {
      schema: {
        GITHUB_CLIENT_ID: envField.string({
          context: "server",
          access: "secret",
        }),
        GITHUB_CLIENT_SECRET: envField.string({
          context: "server",
          access: "secret",
        }),
        GOOGLE_CLIENT_ID: envField.string({
          context: "server",
          access: "secret",
        }),
        GOOGLE_CLIENT_SECRET: envField.string({
          context: "server",
          access: "secret",
        }),
      },
    },
  },
});
