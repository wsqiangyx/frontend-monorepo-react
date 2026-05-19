import test from 'node:test'
import assert from 'node:assert/strict'
import { dirname, join } from 'node:path'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'

import { verifyMockWorkers } from '../verify-mock-worker.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

test('verifyMockWorkers passes when both app workers match the canonical worker file', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-mock-worker-'))
  const canonical = join(workspaceRoot, 'canonical.js')
  const reactWorker = join(workspaceRoot, 'apps/react-app/public/mockServiceWorker.js')

  writeFile(canonical, 'worker-v1')
  writeFile(reactWorker, 'worker-v1')

  assert.doesNotThrow(() =>
    verifyMockWorkers({
      canonicalWorkerPath: canonical,
      appWorkerPaths: [reactWorker],
    }),
  )
})

test('verifyMockWorkers fails when an app worker drifts from the canonical worker file', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-mock-worker-'))
  const canonical = join(workspaceRoot, 'canonical.js')
  const reactWorker = join(workspaceRoot, 'apps/react-app/public/mockServiceWorker.js')

  writeFile(canonical, 'worker-v1')
  writeFile(reactWorker, 'worker-v2')

  assert.throws(
    () =>
      verifyMockWorkers({
        canonicalWorkerPath: canonical,
        appWorkerPaths: [reactWorker],
      }),
    /mockServiceWorker\.js/,
  )
})
