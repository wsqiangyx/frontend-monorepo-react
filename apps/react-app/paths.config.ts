// ============================================================================
// 路径别名配置
// ============================================================================
// 为开发态和测试态提供源码级路径别名，使应用可以直接引用包的 src/ 源码，
// 而非 dist/ 构建产物。这样开发时修改共享包代码可立即热更新。
//
// 构建态（production build）不使用这些别名，走 package.json exports 指向的 dist/。
//
// 两类别名：
//   sourceAlias — 指向各共享包的 src/ 入口（开发/测试用）
//   appAlias    — 指向应用自身的 src/ 目录（@ 别名）
//
// 注意：别名顺序很重要，更具体的路径（如 @repo/shared-utils/http）必须
//       排在宽泛路径（如 @repo/shared-utils）之前，否则前缀匹配会错误命中。
// ============================================================================

import { fileURLToPath, URL } from 'node:url'

const sourceAlias = [
  {
    find: '@repo/shared-utils/http',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/http/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils/ui-contract',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/ui-contract/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils/api-contract',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/api-contract/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils/routes',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/routes/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils/i18n',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/i18n/index.ts', import.meta.url),
    ),
  },
  {
    find: '@repo/shared-utils',
    replacement: fileURLToPath(
      new URL('../../packages/shared-utils/src/index.ts', import.meta.url),
    ),
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
    find: '@repo/design-tokens/tailwind-preset',
    replacement: fileURLToPath(
      new URL('../../packages/design-tokens/src/theme/tailwind.ts', import.meta.url),
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
]

const appAlias = {
  find: '@',
  replacement: fileURLToPath(new URL('./src', import.meta.url)),
}

export const reactAppSourceAlias = [...sourceAlias, appAlias]
export const reactAppBuildAlias = [appAlias]
