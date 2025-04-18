import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    base: "./",
    build: {
      outDir: "build",
      target: "es2020",
      chunkSizeWarningLimit: 768
    },
    plugins: [
      react({
        babel: {
          plugins: [
            ["babel-plugin-react-compiler"]
          ]
        }
      }),
      VitePWA({
        registerType: "autoUpdate",
        strategies: "injectManifest",
        srcDir: "src",
        filename: "sw.js",
        injectManifest: {
          rollupFormat: "iife",
          globPatterns: [
            "./**/*.{js,css,png,ttf,wasm,zip}",
            "./*.{html,ico,png,js,json}"
          ]
        },
        includeManifestIcons: false,
        manifest: {
          "short_name": "Zip Manager",
          "name": "Zip Manager",
          "description": "Read, edit and write zip files.",
          "start_url": "./index.html",
          "display": "fullscreen",
          "theme_color": "#000000",
          "background_color": "#ffffff",
          "orientation": "any",
          "categories": [
            "utilities"
          ],
          "icons": [
            {
              "src": "assets/icons/icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "assets/icons/icon-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "any"
            },
            {
              "src": "assets/icons/icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            },
            {
              "src": "assets/icons/icon-192x192.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "maskable"
            },
            {
              "src": "assets/icons/icon-512x512-mono.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "monochrome"
            },
            {
              "src": "./assets/icons/icon-192x192-mono.png",
              "sizes": "192x192",
              "type": "image/png",
              "purpose": "monochrome"
            }
          ],
          "file_handlers": [
            {
              "action": "./index.html",
              "accept": {
                "application/zip": [
                  ".zip"
                ],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                  ".docx"
                ],
                "application/epub+zip": [
                  ".epub"
                ],
                "application/java-archive": [
                  ".jar"
                ],
                "application/vnd.oasis.opendocument.presentation": [
                  ".odp"
                ],
                "application/vnd.oasis.opendocument.spreadsheet": [
                  ".ods"
                ],
                "application/vnd.oasis.opendocument.text": [
                  ".odt"
                ],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
                  ".pptx"
                ],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                  ".xlsx"
                ],
                "application/vnd.apple.keynote": [
                  ".key"
                ],
                "application/vnd.apple.pages": [
                  ".pages"
                ],
                "application/vnd.apple.numbers": [
                  ".numbers"
                ],
                "application/vnd.android.package-archive": [
                  ".apk"
                ],
                "application/x-ios-app": [
                  ".ipa"
                ]
              },
              "launch_type": "single-client"
            }
          ],
          "share_target": {
            "action": "./shared-files",
            "enctype": "multipart/form-data",
            "method": "POST",
            "params": {
              "files": [
                {
                  "name": "shared-files",
                  "accept": [
                    "*/*"
                  ]
                }
              ]
            }
          },
          "screenshots": [
            {
              "src": "./screenshots/screenshot-395x640.png",
              "sizes": "395x640",
              "type": "image/png",
              "form_factor": "narrow",
              "label": "Main screen on mobile"
            },
            {
              "src": "./screenshots/screenshot-app-1135x809.png",
              "sizes": "1135x809",
              "type": "image/png",
              "form_factor": "wide",
              "label": "Main screen on desktop"
            },
            {
              "src": "./screenshots/screenshot-custom-395x640.png",
              "sizes": "395x640",
              "type": "image/png",
              "form_factor": "narrow",
              "label": "Custom user interface on mobile"
            }
          ]
        }
      })
    ]
  };
});
