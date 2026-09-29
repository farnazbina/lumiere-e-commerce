import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  timeout: 45000,
  workers: 2,
  use: {
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3100",
    channel: "chrome",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: process.env.TEST_BASE_URL ? undefined : {
    command: "node node_modules/next/dist/bin/next start --port 3100",
    url: "http://localhost:3100",
    reuseExistingServer: false,
    timeout: 30000,
  },
});
