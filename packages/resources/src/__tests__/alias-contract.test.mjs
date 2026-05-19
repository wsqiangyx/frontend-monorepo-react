import { describe, expect, it } from 'vitest'
import {
  collectAliasContractIssues,
  createAliasContractExpectation,
  extractAliasEntriesFromText,
} from '../../../../scripts/check-alias-contract.mjs'

describe('alias contract check', () => {
  it('derives tsconfig expectations from source alias entries', () => {
    const expectations = createAliasContractExpectation([
      {
        find: '@repo/shared/http',
        target: '../../packages/shared/src/http/index.ts',
      },
      {
        find: '@repo/resources',
        target: '../../packages/resources/src',
      },
    ])

    expect(expectations).toEqual({
      '@repo/shared/http': ['../../packages/shared/src/http/index.ts'],
      '@repo/resources': ['../../packages/resources/src/index.ts'],
      '@repo/resources/*': ['../../packages/resources/src/*/index.ts'],
    })
  })

  it('extracts shared alias entries from paths config sourceAlias definitions', () => {
    const configText = `
const sourceAlias = [
  {
    find: '@repo/shared/http',
    replacement: fileURLToPath(new URL('../../packages/shared/src/http/index.ts', import.meta.url)),
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

export const appSourceAlias = [...sourceAlias, appAlias]
`

    expect(extractAliasEntriesFromText(configText)).toEqual([
      {
        find: '@repo/shared/http',
        target: '../../packages/shared/src/http/index.ts',
      },
      {
        find: '@repo/resources',
        target: '../../packages/resources/src',
      },
    ])
  })

  it('reports missing and unexpected shared alias mappings', () => {
    const issues = collectAliasContractIssues({
      aliasEntries: [
        {
          find: '@repo/shared/http',
          target: '../../packages/shared/src/http/index.ts',
        },
        {
          find: '@repo/resources',
          target: '../../packages/resources/src',
        },
      ],
      tsconfigPaths: {
        '@repo/resources': ['../../packages/resources/src/index.ts'],
        '@repo/extra': ['../../packages/extra/src/index.ts'],
      },
    })

    expect(issues).toEqual([
      'Missing tsconfig path mapping for "@repo/shared/http": expected ../../packages/shared/src/http/index.ts',
      'Missing tsconfig path mapping for "@repo/resources/*": expected ../../packages/resources/src/*/index.ts',
      'Unexpected shared tsconfig path mapping "@repo/extra": ../../packages/extra/src/index.ts',
    ])
  })
})
