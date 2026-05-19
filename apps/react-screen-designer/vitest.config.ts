import { defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { screenDesignerSourceAlias } from './paths.config'

export default defineProject({
  plugins: [react(), UnoCSS()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: screenDesignerSourceAlias,
  },
})
