import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base:
    process.env.NODE_ENV === 'production'
      ? process.env.GH_PAGES_BASE
        ? process.env.GH_PAGES_BASE
        : '/life-compass'
      : '/',
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    // Exclude end-to-end tests from running with "npm test"
    exclude: ['e2e/**'],
    globals: true
  },
});
