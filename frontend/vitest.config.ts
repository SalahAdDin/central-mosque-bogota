import { getViteConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { coverageConfigDefaults } from "vitest/config";

const dirname
  = typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// TODO: Astro v6 requires Vitest 4.1 to avoid issues
export default getViteConfig({
  build: {
    rollupOptions: {
      output: {
        banner:
          "/* ﷽ - In the name of Allah, the Most Gracious, the Most Merciful */",
      },
    },
  },
  resolve: {
    alias: {
      "@components": path.resolve(dirname, "src/components"),
      "@layouts": path.resolve(dirname, "src/layouts"),
      "@styles": path.resolve(dirname, "src/styles"),
      "@utils": path.resolve(dirname, "src/utils"),
      "@": path.resolve(dirname, "src"),
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
    ],
  },
});
