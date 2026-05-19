import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const stdout = globalThis.console

const EXPECTED_ROUTES = ['/system/users', '/system/roles', '/system/dictionaries', '/system/meta']

function readJson(relativePath) {
  return JSON.parse(readFileSync(resolve(rootDir, relativePath), 'utf8'))
}

function readText(relativePath) {
  return readFileSync(resolve(rootDir, relativePath), 'utf8')
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

function validateRouteMeta(routeMeta) {
  invariant(Array.isArray(routeMeta), 'Phase 2 route meta must be an array')

  const issues = []
  const metaByPath = new Map()

  for (const route of routeMeta) {
    const { path, title, menuKey, permissionCodes } = route ?? {}

    if (typeof path !== 'string' || path.length === 0) {
      issues.push('Phase 2 route meta contains an invalid path entry')
      continue
    }

    if (metaByPath.has(path)) {
      issues.push(`Duplicate Phase 2 route meta path: ${path}`)
      continue
    }

    metaByPath.set(path, route)

    if (typeof title !== 'string' || title.length === 0) {
      issues.push(`Route ${path} is missing a valid title`)
    }

    if (typeof menuKey !== 'string' || menuKey.length === 0) {
      issues.push(`Route ${path} is missing a valid menuKey`)
    }

    if (
      !Array.isArray(permissionCodes) ||
      permissionCodes.length === 0 ||
      permissionCodes.some((code) => typeof code !== 'string' || code.length === 0)
    ) {
      issues.push(`Route ${path} is missing valid permissionCodes`)
    }
  }

  expectExactMembers(metaByPath.keys(), EXPECTED_ROUTES, 'Phase 2 route paths')
  return issues
}

function main() {
  const routeMeta = readJson('apps/react-app/src/router/phase2-route-meta.json')
  const routerSource = readText('apps/react-app/src/router/index.tsx')

  invariant(
    routerSource.includes("import phase2RouteMeta from './phase2-route-meta.json'"),
    'React router must import phase2-route-meta.json',
  )

  for (const expectedPath of EXPECTED_ROUTES) {
    invariant(
      routerSource.includes(`getPhase2RouteMeta('${expectedPath}')`),
      `React router must consume Phase 2 route meta for ${expectedPath}`,
    )
  }

  const issues = validateRouteMeta(routeMeta)

  if (issues.length === 0) {
    stdout.log('PASS Phase 2 route integrity check:')
    stdout.log(`  Checked ${EXPECTED_ROUTES.length} routes: ${EXPECTED_ROUTES.join(', ')}`)
    stdout.log('  Phase 2 route metadata is structured and consistent.')
    return
  }

  stdout.error('FAIL Phase 2 route integrity check:')
  for (const issue of issues) {
    stdout.error(`  - ${issue}`)
  }
  process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
