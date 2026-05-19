import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { resolveCanonicalWorkerPath } from './verify-mock-worker.mjs'

const workspaceRoot = resolve(import.meta.dirname, '..')
const canonicalWorkerPath = resolveCanonicalWorkerPath(workspaceRoot)
const appWorkerPaths = [resolve(workspaceRoot, 'apps/react-app/public/mockServiceWorker.js')]

for (const appWorkerPath of appWorkerPaths) {
  mkdirSync(dirname(appWorkerPath), { recursive: true })
  copyFileSync(canonicalWorkerPath, appWorkerPath)
}
