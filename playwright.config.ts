import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:5000',
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
});
