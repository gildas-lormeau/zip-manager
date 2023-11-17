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
        injectManifest: {
          rollupFormat: "iife",
          globPatterns: [
            "./assets/**/*.{js,css,png,ttf,wasm,zip}",
            "./*.{html,ico,png,js,json}"
          ]
        }
      })
    ]
  };
});
