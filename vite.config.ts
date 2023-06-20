/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/dirty-checkers/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
//    globals: true,
    setupFiles: './tests/setup.js'
  },
})
