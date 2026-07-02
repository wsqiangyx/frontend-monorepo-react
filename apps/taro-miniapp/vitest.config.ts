import { defineProject } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

export default defineProject({
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'threads',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@repo/cross-platform-utils': fileURLToPath(
        new URL('../../packages/cross-platform-utils/src/index.ts', import.meta.url),
      ),
      '@repo/shared-utils': fileURLToPath(
        new URL('../../packages/shared-utils/src/index.ts', import.meta.url),
      ),
      '@repo/shared-service': fileURLToPath(
        new URL('../../packages/shared-service/src/index.ts', import.meta.url),
      ),
    },
  },
})
