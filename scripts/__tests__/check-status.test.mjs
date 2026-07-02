import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

import { checkStatusConsistency } from '../check-status.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

function createWorkspaceRoot() {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-check-status-'))

  for (const appName of ['react-app', 'taro-miniapp']) {
    mkdirSync(join(workspaceRoot, 'apps', appName), { recursive: true })
  }

  for (const packageName of [
    'cross-platform-utils',
    'shared-utils',
    'shared-service',
    'design-tokens',
    'mock',
    'shared-ui',
  ]) {
    mkdirSync(join(workspaceRoot, 'packages', packageName), { recursive: true })
  }

  writeFile(
    join(workspaceRoot, 'STATUS.yaml'),
    [
      'version: 1',
      'updated_at: 2026-07-02',
      'apps:',
      '  react-app:',
      '    status: stable',
      '  taro-miniapp:',
      '    status: candidate',
      'packages:',
      '  cross-platform-utils:',
      '    status: candidate',
      '  shared-utils:',
      '    status: stable',
      '  shared-service:',
      '    status: stable',
      '  design-tokens:',
      '    status: stable',
      '  mock:',
      '    status: stable',
      '  shared-ui:',
      '    status: stable',
      '',
    ].join('\n'),
  )

  writeFile(
    join(workspaceRoot, 'package.json'),
    JSON.stringify(
      {
        scripts: {
          build: 'pnpm build:shared && pnpm --filter @repo/react-app build',
          'build:shared':
            'pnpm --filter @repo/shared-utils build && pnpm --filter @repo/shared-service build && pnpm --filter @repo/design-tokens build && pnpm --filter @repo/mock build && pnpm --filter @repo/shared-ui build',
          'build:react': 'pnpm build:shared && pnpm -F @repo/react-app build',
          'build:cross-platform-utils': 'pnpm -F @repo/cross-platform-utils build',
          typecheck:
            'pnpm build:shared && pnpm --filter @repo/shared-utils typecheck && pnpm --filter @repo/shared-service typecheck && pnpm --filter @repo/design-tokens typecheck && pnpm --filter @repo/mock typecheck && pnpm --filter @repo/shared-ui typecheck && pnpm --filter @repo/react-app typecheck',
          test: 'pnpm --filter @repo/shared-utils test && pnpm --filter @repo/shared-service test && pnpm --filter @repo/design-tokens test && pnpm --filter @repo/mock test && pnpm --filter @repo/shared-ui test && pnpm --filter @repo/react-app test',
          'test:coverage':
            'pnpm --filter @repo/shared-utils test:coverage && pnpm --filter @repo/shared-service test:coverage && pnpm --filter @repo/design-tokens test:coverage && pnpm --filter @repo/mock test:coverage && pnpm --filter @repo/shared-ui test:coverage && pnpm --filter @repo/react-app test:coverage',
          'test:scripts': 'node --test "scripts/__tests__/*.test.mjs"',
          verify: 'pnpm check:status && pnpm test:scripts',
        },
      },
      null,
      2,
    ),
  )

  writeFile(
    join(workspaceRoot, 'vitest.config.ts'),
    [
      "import { defineConfig } from 'vitest/config'",
      '',
      'export default defineConfig({',
      '  test: {',
      '    projects: [',
      "      'packages/shared-utils/vitest.config.ts',",
      "      'packages/shared-service/vitest.config.ts',",
      "      'packages/design-tokens/vitest.config.ts',",
      "      'packages/mock/vitest.config.ts',",
      "      'packages/shared-ui/vitest.config.ts',",
      "      'apps/react-app/vitest.config.ts',",
      "      'packages/cross-platform-utils/vitest.config.ts',",
      "      'apps/taro-miniapp/vitest.config.ts',",
      '    ],',
      '  },',
      '})',
      '',
    ].join('\n'),
  )

  return workspaceRoot
}

test('checkStatusConsistency passes when STATUS.yaml matches the current root contract', () => {
  const workspaceRoot = createWorkspaceRoot()
  assert.doesNotThrow(() => checkStatusConsistency(workspaceRoot))
})
