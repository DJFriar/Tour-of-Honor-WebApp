import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([
  globalIgnores(["**/rider-management.js", "static/js/orders.js", "**/flag-manager.js"]),
  {
    extends: compat.extends("airbnb", "prettier"),

    plugins: {
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jquery,
        ...globals.node,
        toastr: "writable",
        UIKit: "writable",
      },
    },

    rules: {
      "prettier/prettier": ["error"],
      "default-case-last": "error",
      "default-param-last": ["error"],
      "func-names": "off",

      "no-plusplus": [2, {
        allowForLoopAfterthoughts: true,
      }],

      "no-use-before-define": ["error", "nofunc"],
      "no-useless-call": "error",
      "prefer-exponentiation-operator": "error",
      "prefer-regex-literals": "error",
      "no-restricted-globals": "off",
    },
  },
]);
