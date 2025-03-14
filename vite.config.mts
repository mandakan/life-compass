import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production'
    ? (process.env.GH_PAGES_BASE ? process.env.GH_PAGES_BASE : '/life-compass/')
    : '/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
  },
});
