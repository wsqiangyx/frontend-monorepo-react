import { fileURLToPath, URL } from 'node:url'

const sourceAlias = [
  {
    find: '@repo/shared-utils/http',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/http/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-i18n',
    replacement: fileURLToPath(new URL('../../packages/shared-i18n/src/index.ts', import.meta.url)),
  },
  {
    find: '@repo/shared/http',
    replacement: fileURLToPath(new URL('../../packages/shared/src/http/index.ts', import.meta.url)),
  },
  {
    find: '@repo/shared',
    replacement: fileURLToPath(new URL('../../packages/shared/src/index.ts', import.meta.url)),
  },
  {
    find: '@repo/shared-service',
    replacement: fileURLToPath(
      new URL('../../packages/shared-service/src/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/mock/browser',
    replacement: fileURLToPath(new URL('../../packages/mock/src/browser.ts', import.meta.url)),
  },
  {
    find: '@repo/mock/server',
    replacement: fileURLToPath(new URL('../../packages/mock/src/server.ts', import.meta.url)),
  },
  {
    find: '@repo/design-tokens/css',
    replacement: fileURLToPath(
      new URL('../../packages/design-tokens/src/to-css.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/design-tokens/theme/antd',
    replacement: fileURLToPath(
      new URL('../../packages/design-tokens/src/theme/antd.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/design-tokens/theme',
    replacement: fileURLToPath(
      new URL('../../packages/design-tokens/src/theme/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-ui/style.css',
    replacement: fileURLToPath(new URL('../../packages/shared-ui/src/style.css', import.meta.url)),
  },
  {
    find: '@repo/shared-ui',
    replacement: fileURLToPath(new URL('../../packages/shared-ui/src/index.ts', import.meta.url)),
  },
  {
    find: '@repo/resources',
    replacement: fileURLToPath(new URL('../../packages/resources/src', import.meta.url)),
  },
]

const appAlias = {
  find: '@',
  replacement: fileURLToPath(new URL('./src', import.meta.url)),
}

export const screenDesignerSourceAlias = [...sourceAlias, appAlias]
export const screenDesignerBuildAlias = [appAlias]
