/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";
// import { coverageConfigDefaults } from "vitest/config";

export default getViteConfig({
  test: {
    globals: true,
    clearMocks: true,
    css: true,
    include: ["src/**/*.{test,spec}.{astro,js,jsx,ts,tsx}"],
    exclude: ["tests"],
    coverage: {
      //   exclude: [...coverageConfigDefaults.exclude],
      provider: "v8",
      reporter: ["text", "html"],
      thresholds: {
        branches: 90,
        functions: 95,
        lines: 80,
        statements: 80,
      },
    },
    passWithNoTests: true,
    environment: "happy-dom",
    setupFiles: ["./src/vitest.setup.ts"],
  },
});
