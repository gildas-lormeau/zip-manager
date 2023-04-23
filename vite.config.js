import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      outDir: "build"
    },
    plugins: [
      react(),
      VitePWA({
        registerType: "autoUpdate",
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.js",
        workbox: {
          globPatterns: [
            "./assets/**/*.{js,css,html,png,ttf}",
            "./*.{html,ico,png}"
          ]
        }
      })
    ]
  };
});
