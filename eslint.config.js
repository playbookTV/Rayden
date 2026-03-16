import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Node.js files (MCP server, scripts)
    files: ["packages/**/*.ts", "packages/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.node,
        console: "readonly",
      },
    },
  },
  {
    ignores: [
      "dist/**",
      "**/dist/**",
      "node_modules/**",
      "**/node_modules/**",
      "coverage/**",
      "storybook-static/**",
      "*.config.{js,ts}",
      ".storybook/**",
      "packages/**/dist/**",
      "packages/docs/**",
      "scripts/**",
    ],
  }
);
