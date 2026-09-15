import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Config central de Playwright.
 *
 * "projects" define en que dispositivos/viewports corre cada test. Los
 * presets de "devices" (Pixel 5, iPhone 13, Desktop Chrome, etc.) son los
 * mismos perfiles que aparecen en el selector de dispositivo del inspector
 * de Chrome (DevTools > Toggle device toolbar)
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: process.env.BASE_URL || "https://www.saucedemo.com",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },

  projects: [
    {
      name: "desktop-chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chrome",
      // Pixel 5: mismo preset que aparece en el device toolbar de Chrome DevTools.
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "mobile-safari",
      // iPhone 13: cubre motor Webkit ademas de un viewport de celular distinto.
      use: { ...devices["iPhone 13"] },
    },
  ],
});
