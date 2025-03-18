import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude end-to-end tests from running with "npm test"
    exclude: ['e2e/**']
  }
});
```‬