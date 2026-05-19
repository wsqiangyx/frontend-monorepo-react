import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

export function verifyMockWorkers(input) {
  const canonicalWorker = readFileSync(input.canonicalWorkerPath, 'utf8')

  for (const appWorkerPath of input.appWorkerPaths) {
    const appWorker = readFileSync(appWorkerPath, 'utf8')

    if (appWorker !== canonicalWorker) {
      throw new Error(
        `mockServiceWorker.js drift detected: ${appWorkerPath} does not match canonical worker ${input.canonicalWorkerPath}.`,
      )
    }
  }
}

export function resolveCanonicalWorkerPath(workspaceRoot) {
  return resolve(workspaceRoot, 'packages/mock/public/mockServiceWorker.js')
}

function main() {
  const workspaceRoot = resolve(import.meta.dirname, '..')
  const canonicalWorkerPath = resolveCanonicalWorkerPath(workspaceRoot)

  const appWorkerPaths = [resolve(workspaceRoot, 'apps/react-app/public/mockServiceWorker.js')]

  verifyMockWorkers({
    canonicalWorkerPath,
    appWorkerPaths,
  })
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
