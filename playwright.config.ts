import { defineConfig, devices } from "@playwright/test";

const localPort = Number(process.env.E2E_PORT || 4175);
const localBaseUrl = `http://127.0.0.1:${localPort}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? localBaseUrl,
    trace: "retain-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm.cmd run dev -- --host 127.0.0.1 --port ${localPort} --strictPort`,
        url: localBaseUrl,
        reuseExistingServer: false,
        timeout: 120_000,
      },
  projects: [
    { name: "mobile-small", use: { ...devices["iPhone SE"], browserName: "chromium" } },
    { name: "mobile", use: { ...devices["iPhone 13"], browserName: "chromium" } },
    { name: "tablet", use: { ...devices["iPad Mini"], browserName: "chromium" } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
});
