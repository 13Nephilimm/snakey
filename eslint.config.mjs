import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        HTMLParagraphElement: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tseslint,
    },

    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,

      "@typescript-eslint/no-explicit-any": "off", // for quick prototyping
      "no-undef": "off", // ignore undefined errors for browser globals
    },
  },
];
