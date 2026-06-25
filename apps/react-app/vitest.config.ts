import { defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { reactAppSourceAlias } from './paths.config'

export default defineProject({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: reactAppSourceAlias,
  },
})
