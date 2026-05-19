import { defineProject } from 'vitest/config'

export default defineProject({
  cacheDir: './node_modules/.vite',
  test: {
    globals: true,
    environment: 'node',
    pool: 'threads',
  },
})
