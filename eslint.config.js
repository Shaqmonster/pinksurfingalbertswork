// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import headers from 'eslint-plugin-headers';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  {
    plugins: {
      headers,
    },
    ignores: ["packages/core/src/api"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "headers/header-format": [
        "error",
        {
          source: "string",
          content: "Copyright (C) LoginID",
          style: "line",
          trailingNewlines: 2,
        }
      ]
    },
  },
  {
    files: ["packages/websdk3/**/*.{ts,tsx}", "packages/core/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-unsafe-declaration-merging": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  }
);
