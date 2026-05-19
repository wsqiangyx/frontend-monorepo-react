import { readFileSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stdout = globalThis.console

const appContracts = [
  {
    name: '@repo/react-app',
    pathsConfigPath: 'apps/react-app/paths.config.ts',
    tsconfigPath: 'apps/react-app/tsconfig.app.json',
  },
]

export function extractAliasEntriesFromText(text) {
  const aliasEntryPattern =
    /find:\s*'(@repo\/[^']+)'\s*,[\s\S]*?new URL\('([^']+)',\s*import\.meta\.url\)/g
  const aliasEntries = []

  for (const match of text.matchAll(aliasEntryPattern)) {
    aliasEntries.push({
      find: match[1],
      target: normalizeRelativePath(match[2]),
    })
  }

  return aliasEntries
}

export function createAliasContractExpectation(aliasEntries) {
  return Object.fromEntries(
    aliasEntries.flatMap(({ find, target }) => {
      if (find === '@repo/resources' && target.endsWith('/src')) {
        return [
          [find, [normalizeRelativePath(`${target}/index.ts`)]],
          [`${find}/*`, [normalizeRelativePath(`${target}/*/index.ts`)]],
        ]
      }

      return [[find, [normalizeRelativePath(target)]]]
    }),
  )
}

export function collectAliasContractIssues({ aliasEntries, tsconfigPaths }) {
  const expectedPaths = createAliasContractExpectation(aliasEntries)
  const issues = []

  for (const [key, expectedValue] of Object.entries(expectedPaths)) {
    const actualValue = tsconfigPaths[key]

    if (!actualValue) {
      issues.push(
        `Missing tsconfig path mapping for "${key}": expected ${expectedValue.join(', ')}`,
      )
      continue
    }

    if (!isSamePathList(actualValue, expectedValue)) {
      issues.push(
        `Invalid tsconfig path mapping for "${key}": expected ${expectedValue.join(', ')}, received ${actualValue.join(', ')}`,
      )
    }
  }

  for (const [key, value] of Object.entries(tsconfigPaths)) {
    if (!key.startsWith('@repo/')) {
      continue
    }

    if (!(key in expectedPaths)) {
      issues.push(`Unexpected shared tsconfig path mapping "${key}": ${value.join(', ')}`)
    }
  }

  return issues
}

function normalizeRelativePath(filePath) {
  return filePath.replace(/\\/g, '/').replace(/\/+/g, '/')
}

function isSamePathList(actualValue, expectedValue) {
  return (
    Array.isArray(actualValue) &&
    actualValue.length === expectedValue.length &&
    actualValue.every((entry, index) => normalizeRelativePath(entry) === expectedValue[index])
  )
}

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(rootDir, relativePath), 'utf8'))
}

function readText(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), 'utf8')
}

function checkAppAliasContract({ name, pathsConfigPath, tsconfigPath }) {
  const aliasEntries = extractAliasEntriesFromText(readText(pathsConfigPath))
  const tsconfig = readJson(tsconfigPath)
  const tsconfigPaths = tsconfig.compilerOptions?.paths ?? {}
  const issues = collectAliasContractIssues({ aliasEntries, tsconfigPaths })

  return {
    name,
    issues,
    pathsConfigPath,
    tsconfigPath,
  }
}

function formatResult(result) {
  if (result.issues.length === 0) {
    return `PASS ${result.name}: ${toRepoPath(result.pathsConfigPath)} <-> ${toRepoPath(result.tsconfigPath)}`
  }

  return [
    `FAIL ${result.name}: ${toRepoPath(result.pathsConfigPath)} <-> ${toRepoPath(result.tsconfigPath)}`,
    ...result.issues.map((issue) => `  - ${issue}`),
  ].join('\n')
}

function toRepoPath(relativePath) {
  return normalizeRelativePath(relative(rootDir, resolve(rootDir, relativePath)) || relativePath)
}

function main() {
  const results = appContracts.map(checkAppAliasContract)
  const hasIssues = results.some((result) => result.issues.length > 0)

  for (const result of results) {
    stdout.log(formatResult(result))
  }

  if (hasIssues) {
    throw new Error('Shared alias contract check failed.')
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
