import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react,
      "react-compiler": reactCompiler
    },
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        console: "readonly",
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        }
      }
    },
    rules: {
      "react/jsx-uses-vars": "error",
      "react/jsx-uses-react": "error",
      "indent": ["error", 2],
      "linebreak-style": ["error", "unix"],
      "quotes": ["error", "double"],
      "semi": ["warn", "always"],
      "no-console": ["warn"],
      "no-debugger": ["warn"],
      "no-unused-vars": "warn",
      "react-compiler/react-compiler": "error",
    },
    ignores: [
      "**/node_modules/",
      ".git/"
    ]
  }
];