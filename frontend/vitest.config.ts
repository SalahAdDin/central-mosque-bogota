import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { getViteConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { coverageConfigDefaults } from "vitest/config";

const dirname
  = typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

export default getViteConfig({
  build: {
    rollupOptions: {
      output: {
        banner:
          "/* ﷽ - In the name of Allah, the Most Gracious, the Most Merciful */",
      },
    },
  },
  test: {
    globals: true,
    css: true,
    clearMocks: true,
    restoreMocks: true,
    passWithNoTests: true,
    coverage: {
      exclude: [...coverageConfigDefaults.exclude],
      provider: "v8",
      reporter: ["html", "verbose"],
      thresholds: {
        branches: 90,
        functions: 95,
        lines: 80,
        statements: 80,
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.{test,spec}.{astro,js,jsx,ts,tsx}"],
          exclude: ["tests"],
          environment: "node",
          setupFiles: ["./src/vitest.setup.ts"],
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, ".storybook"),
            storybookScript: "pnpm storybook --no-open",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
      },
    ],
  },
});
