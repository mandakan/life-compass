import { devices, defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        baseURL: process.env.BASE_URL || 'http://localhost:4173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'firefox-desktop',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 },
        baseURL: process.env.BASE_URL || 'http://localhost:4173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'webkit-desktop',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 },
        baseURL: process.env.BASE_URL || 'http://localhost:4173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        browserName: 'chromium',
        ...devices['Pixel 5'],
        baseURL: process.env.BASE_URL || 'http://localhost:4173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  webServer: {
    command: 'npm run preview',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
});
