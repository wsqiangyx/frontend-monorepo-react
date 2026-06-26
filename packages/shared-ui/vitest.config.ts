import { defineProject } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineProject({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    pool: 'threads',
  },
  resolve: {
    alias: {
      '@repo/shared-service': fileURLToPath(
        new URL('../shared-service/src/index.ts', import.meta.url),
      ),
      '@repo/shared-types/ui-contract': fileURLToPath(
        new URL('../shared-types/src/ui-contract/index.ts', import.meta.url),
      ),
      '@repo/design-tokens/tailwind-preset': fileURLToPath(
        new URL('../design-tokens/src/theme/tailwind.ts', import.meta.url),
      ),
      '@repo/design-tokens/theme': fileURLToPath(
        new URL('../design-tokens/src/theme/index.ts', import.meta.url),
      ),
      '@repo/design-tokens': fileURLToPath(
        new URL('../design-tokens/src/index.ts', import.meta.url),
      ),
    },
  },
})
