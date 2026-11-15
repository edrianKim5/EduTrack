import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative paths let Vite assets work on a GitHub Pages project subdirectory.
  base: './',
});
