import { defineConfig } from "@playwright/test";

/**
 * Captura visual determinista: un solo Chromium, viewport y escala fijos, sin reintentos
 * y sin paralelismo, para que ANTES y DESPUÉS salgan del mismo motor en la misma máquina.
 */
export default defineConfig({
  testDir: ".",
  testMatch: /visual\.spec\.ts$/,
  outputDir: "test-results",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    viewport: { width: 800, height: 640 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    reducedMotion: "reduce",
  },
});
