import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { getViteConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { coverageConfigDefaults } from "vitest/config";

// Get the current directory name, work-fix for Windows system
function getDirname(): string {
  if (typeof __dirname !== "undefined") return __dirname;

  const metaUrl = import.meta.url;
  if (metaUrl.startsWith("file:")) return path.dirname(fileURLToPath(metaUrl));

  return path.dirname(metaUrl);
}

const dirname = getDirname();

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
