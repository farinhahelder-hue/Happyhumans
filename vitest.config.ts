import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Tests déterministes quel que soit le fuseau de la machine (CI en UTC, poste local en Europe/Paris).
process.env.TZ = 'UTC';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});