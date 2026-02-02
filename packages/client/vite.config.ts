/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  base: './', // <--- This forces relative paths
  test: {
    globals: true,             // Allows using describe/expect without importing
    environment: 'jsdom',      // Simulates a browser
    setupFiles: './src/setupTests.ts', // Runs your setup before tests
    css: true,                 // (Optional) Processes CSS modules
  },
})
