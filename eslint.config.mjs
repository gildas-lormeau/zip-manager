import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.git/**",
      "build/**",
      "public/**",
      "**/src/zip-manager/services/lib/**"
    ]
  },
  js.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      "react-refresh": reactRefresh
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        console: "readonly"
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      "react-refresh/only-export-components": ["warn"],
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["warn", "always"],
      "no-console": "warn",
      "no-debugger": "warn",
      "no-unused-vars": "warn"
    },
    ignores: [
      "**/node_modules/",
      ".git/",
      "**/src/zip-manager/services/lib/**"
    ]
  }
];