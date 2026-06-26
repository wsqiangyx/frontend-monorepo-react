import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const defaultRootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const STABLE_APP_NAMES = ['react-app']
const EXPERIMENTAL_APP_NAMES = []
const STABLE_PACKAGE_NAMES = [
  'shared-types',
  'shared-utils',
  'shared-i18n',
  'shared-service',
  'design-tokens',
  'resources',
  'mock',
  'shared-ui',
]

function listWorkspaceDirectories(rootDir, relativeDir) {
  return readdirSync(resolve(rootDir, relativeDir), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function parseStatusYaml(content) {
  const result = { version: '', updated_at: '', apps: {}, packages: {} }
  let section = ''
  let currentKey = ''

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.replace(/\t/g, '    ')

    if (line.trim() === '') {
      continue
    }

    const rootMatch = line.match(/^([a-z_]+):\s*(.*)$/)
    if (rootMatch && !line.startsWith(' ')) {
      const [, key, value] = rootMatch

      if (key === 'apps' || key === 'packages') {
        section = key
        currentKey = ''
      } else {
        result[key] = value
      }

      continue
    }

    const entryMatch = line.match(/^[ ]{2}([^:\s][^:]*):\s*$/)
    if (entryMatch && section) {
      currentKey = entryMatch[1]
      result[section][currentKey] = {}
      continue
    }

    const propertyMatch = line.match(/^[ ]{4}([a-z_]+):\s*(.+)$/)
    if (propertyMatch && section && currentKey) {
      const [, key, value] = propertyMatch
      result[section][currentKey][key] = value
    }
  }

  return result
}

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function expectExactMembers(actual, expected, label) {
  const actualSorted = [...actual].sort()
  const expectedSorted = [...expected].sort()

  invariant(
    actualSorted.length === expectedSorted.length &&
      actualSorted.every((value, index) => value === expectedSorted[index]),
    `${label} mismatch.\nExpected: ${expectedSorted.join(', ')}\nActual: ${actualSorted.join(', ')}`,
  )
}

function assertScriptContains(scriptName, expectedFragment, scripts) {
  const script = scripts[scriptName]
  invariant(typeof script === 'string', `Missing root script: ${scriptName}`)
  invariant(
    script.includes(expectedFragment),
    `Root script "${scriptName}" must include "${expectedFragment}"`,
  )
}

function assertScriptExcludes(scriptName, unexpectedFragment, scripts) {
  const script = scripts[scriptName]
  invariant(typeof script === 'string', `Missing root script: ${scriptName}`)
  invariant(
    !script.includes(unexpectedFragment),
    `Root script "${scriptName}" must not include "${unexpectedFragment}"`,
  )
}

export function checkStatusConsistency(rootDir = defaultRootDir) {
  const status = parseStatusYaml(readFileSync(resolve(rootDir, 'STATUS.yaml'), 'utf8'))
  const packageJson = JSON.parse(readFileSync(resolve(rootDir, 'package.json'), 'utf8'))
  const vitestConfig = readFileSync(resolve(rootDir, 'vitest.config.ts'), 'utf8')
  const scripts = packageJson.scripts ?? {}

  invariant(status.version === '1', 'STATUS.yaml version must be 1')
  invariant(
    /^\d{4}-\d{2}-\d{2}$/.test(status.updated_at),
    'STATUS.yaml updated_at must use YYYY-MM-DD',
  )

  const appNames = Object.keys(status.apps)
  const packageNames = Object.keys(status.packages)
  expectExactMembers(appNames, listWorkspaceDirectories(rootDir, 'apps'), 'STATUS.yaml apps')
  expectExactMembers(
    packageNames,
    listWorkspaceDirectories(rootDir, 'packages'),
    'STATUS.yaml packages',
  )

  expectExactMembers(
    appNames.filter((name) => status.apps[name].status === 'stable'),
    STABLE_APP_NAMES,
    'Stable apps in STATUS.yaml',
  )
  expectExactMembers(
    appNames.filter((name) => status.apps[name].status === 'experimental'),
    EXPERIMENTAL_APP_NAMES,
    'Experimental apps in STATUS.yaml',
  )
  expectExactMembers(
    packageNames.filter((name) => status.packages[name].status === 'stable'),
    STABLE_PACKAGE_NAMES,
    'Stable packages in STATUS.yaml',
  )

  for (const name of STABLE_PACKAGE_NAMES) {
    assertScriptContains('build:shared', `@repo/${name}`, scripts)
    assertScriptContains('typecheck', `@repo/${name}`, scripts)
    assertScriptContains('test', `@repo/${name}`, scripts)
    assertScriptContains('test:coverage', `@repo/${name}`, scripts)
    invariant(
      vitestConfig.includes(`packages/${name}/vitest.config.ts`),
      `Root vitest matrix missing ${name}`,
    )
  }

  for (const name of STABLE_APP_NAMES) {
    assertScriptContains('build', `@repo/${name}`, scripts)
    assertScriptContains('build:react', `@repo/${name}`, scripts)
    assertScriptContains('typecheck', `@repo/${name}`, scripts)
    assertScriptContains('test', `@repo/${name}`, scripts)
    assertScriptContains('test:coverage', `@repo/${name}`, scripts)
    invariant(
      vitestConfig.includes(`apps/${name}/vitest.config.ts`),
      `Root vitest matrix missing ${name}`,
    )
  }

  for (const name of EXPERIMENTAL_APP_NAMES) {
    assertScriptExcludes('build', `@repo/${name}`, scripts)
    assertScriptExcludes('build:shared', `@repo/${name}`, scripts)
    assertScriptExcludes('build:react', `@repo/${name}`, scripts)
    assertScriptExcludes('typecheck', `@repo/${name}`, scripts)
    assertScriptExcludes('test', `@repo/${name}`, scripts)
    assertScriptExcludes('test:coverage', `@repo/${name}`, scripts)
    invariant(
      !vitestConfig.includes(`apps/${name}/vitest.config.ts`),
      `Experimental app ${name} must not be in the root vitest matrix`,
    )
  }

  assertScriptContains('verify', 'pnpm check:status', scripts)
  assertScriptContains('verify', 'pnpm test:scripts', scripts)
  invariant(typeof scripts['test:scripts'] === 'string', 'Missing root script: test:scripts')
}

function main() {
  checkStatusConsistency()
  globalThis.console.log('PASS STATUS consistency check')
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
