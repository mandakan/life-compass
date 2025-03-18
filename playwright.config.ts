import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4173', // This should point to your production-like server
    headless: true, // Run tests in headless mode
    screenshot: 'only-on-failure', // Capture screenshots when tests fail
    video: 'retain-on-failure', // Record video for debugging
  },
  webServer: {
    command: 'npm run preview', // Runs the production-like server
    port: 4173, // Default preview server port
    reuseExistingServer: !process.env.CI, // Reuse server locally
  },
});