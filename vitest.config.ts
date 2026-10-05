import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Tests déterministes quel que soit le fuseau de la machine (CI en UTC, poste local en Europe/Paris).
process.env.TZ = 'UTC';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, '.') } }, // même alias que tsconfig.json
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
});