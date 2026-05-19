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
      '@repo/platform-core': fileURLToPath(
        new URL('../platform-core/src/index.ts', import.meta.url),
      ),
      '@repo/shared/ui-contract': fileURLToPath(
        new URL('../shared/src/ui-contract/index.ts', import.meta.url),
      ),
      '@repo/design-tokens/theme/antd': fileURLToPath(
        new URL('../design-tokens/src/theme/antd.ts', import.meta.url),
      ),
      '@repo/design-tokens/theme': fileURLToPath(
        new URL('../design-tokens/src/theme/index.ts', import.meta.url),
      ),
      '@repo/design-tokens': fileURLToPath(new URL('../design-tokens/src/index.ts', import.meta.url)),
    },
  },
})
