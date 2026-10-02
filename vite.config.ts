import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // <--- Make sure this utility is imported

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolves paths cleanly to absolute machine definitions
      '@': path.resolve(__dirname, './src'),
    },
  },
});
