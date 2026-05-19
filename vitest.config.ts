import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/shared/vitest.config.ts',
      'packages/platform-core/vitest.config.ts',
      'packages/design-tokens/vitest.config.ts',
      'packages/resources/vitest.config.ts',
      'packages/mock/vitest.config.ts',
      'packages/ui-react/vitest.config.ts',
      'apps/react-app/vitest.config.ts',
    ],
  },
})
