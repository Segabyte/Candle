import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import electron from "vite-plugin-electron/simple";
import path from "node:path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "src/shared"),
      "@": path.resolve(__dirname, "src/renderer"),
    },
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: "electron/main.ts",
        vite: {
          resolve: {
            alias: { "@shared": path.resolve(__dirname, "src/shared") },
          },
          build: {
            outDir: "dist-electron",
            // Keep electron-updater external so it's required from node_modules
            // at runtime (electron-builder bundles production deps) rather than
            // being pulled into the main bundle by Rollup.
            rollupOptions: { external: ["electron-updater"] },
          },
        },
      },
      preload: {
        input: "electron/preload.ts",
        vite: { build: { outDir: "dist-electron" } },
      },
    }),
  ],
  build: { outDir: "dist" },
});
