import css from "@eslint/css";
import js from "@eslint/js";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import stylistic from "@stylistic/eslint-plugin";
import vitest from "@vitest/eslint-plugin";
import parserAstro from "astro-eslint-parser";
import astro from "eslint-plugin-astro";
import betterTailwindcss from "eslint-plugin-better-tailwindcss";
import { importX } from "eslint-plugin-import-x";
import jestDOM from "eslint-plugin-jest-dom";
import { configs as sonarjs } from "eslint-plugin-sonarjs";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import { tailwind4 } from "tailwind-csstree";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    "coverage",
    "dist",
    "node_modules",
    ".astro",
    ".github",
    ".vscode",
  ]),
  {
    ...sonarjs.recommended,
    ignores: ["**/*.{json,md,css}"],
    rules: {
      "sonarjs/todo-tag": "warn",
    },
  },
  // Uncomment to enable TypeScript support without type checking to fast linting
  // https://typescript-eslint.io/getting-started/typed-linting/#performance
  // tseslint.configs.strict,
  // tseslint.configs.stylistic,
  // TODO: bug Astro support https://github.com/eslint-stylistic/eslint-stylistic/issues/259
  // TODO: bug ESLINT 10 support: https://github.com/un-ts/eslint-plugin-import-x/issues/421
  stylistic.configs.recommended,
  // importX.configs.recommended,
  importX.configs.typescript,
  {
    // ...sonarjs.recommended,
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx,mts,cts}"],
    // ...importX.configs.recommended,
    plugins: { js, "import-x": importX },
    /*
    extends: [
      js.configs.recommended,
      importX.configs.recommended,
      stylistic.configs.recommended,
    ],
    */
    extends: [
      "js/recommended",
      "import-x/recommended",
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@stylistic/comma-dangle": [
        "error",
        {
          arrays: "only-multiline",
          objects: "only-multiline",
          imports: "only-multiline",
          exports: "only-multiline",
          functions: "never",
        },
      ],
      "@stylistic/function-paren-newline": "warn",
      "@stylistic/implicit-arrow-linebreak": "warn",
      "@stylistic/linebreak-style": ["error", "unix"],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: { delimiter: "semi", requireLast: true },
          singleline: { delimiter: "semi", requireLast: false },
        },
      ],
      "@stylistic/operator-linebreak": "warn",
      "@stylistic/object-curly-newline": [
        "error",
        {
          ExportDeclaration: { multiline: true, minProperties: 5 },
        },
      ],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/semi": ["error", "always"],
      "@typescript-eslint/array-type": [
        "error",
        {
          default: "generic",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-expect-error": "allow-with-description",
        },
      ],
      "@typescript-eslint/consistent-type-definitions": ["error", "type"],
      "@typescript-eslint/explicit-function-return-type": 1,
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          custom: { regex: "^T[A-Z]", match: true },
        },
      ],
      "import-x/no-extraneous-dependencies": [
        "error",
        { devDependencies: true },
      ],
      "import-x/no-unresolved": "error",
      "indent": "off",
    },
  },
  astro.configs.recommended,
  {
    files: ["**/*.astro"],
    extends: [betterTailwindcss.configs.recommended],
    settings: {
      "better-tailwindcss": {
        entryPoint: "./src/styles/global.css",
        detectComponentClasses: true,
      },
    },
    languageOptions: {
      parser: parserAstro,
      parserOptions: {
        parser: tseslint.parser,
      },
    },
    // TODO: bug https://github.com/eslint-stylistic/eslint-stylistic/issues/259
    rules: {
      "@stylistic/arrow-parens": "warn",
      "@stylistic/jsx-one-expression-per-line": "warn",
      "@stylistic/member-delimiter-style": "warn",
      "@stylistic/multiline-ternary": "warn",
      "@stylistic/quotes": "warn",
      "@stylistic/semi": "warn",
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.md"],
    plugins: { markdown },
    language: "markdown/gfm",
    extends: ["markdown/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    languageOptions: {
      customSyntax: tailwind4,
    },
  },
  {
    files: ["src/**/*.test.[tj]s?(x)"],
    ignores: ["src/**/*.e2e.test.[tj]s?(x)"],
    ...jestDOM.configs["flat/recommended"],
    ...testingLibrary.configs["flat/react"],
    ...vitest.configs.recommended,
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/valid-title": [
        "error",
        {
          mustMatch: {
            it: [
              "^should.*when.+$",
              "Test title must include 'should' and 'when'",
            ],
          },
        },
      ],
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
]);
