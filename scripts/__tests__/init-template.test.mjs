import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

import { applyTemplateInitialization } from '../init-template.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

test('applyTemplateInitialization rewrites minimal template placeholders and reports changed files', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-init-template-'))
  const readmePath = join(workspaceRoot, 'README.md')
  const reactMessagesPath = join(workspaceRoot, 'apps/react-app/src/i18n/messages.ts')
  const sharedConstantsPath = join(workspaceRoot, 'packages/shared/src/i18n/constants.ts')
  const themeInitPath = join(workspaceRoot, 'apps/react-app/public/theme-init.js')

  writeFile(
    readmePath,
    ['# frontend-monorepo', 'React Workspace Shell', 'master/staging/test/develop'].join('\n'),
  )
  writeFile(
    reactMessagesPath,
    [
      'export const messages = {',
      "  'home.title': 'React Workspace Shell',",
      "  'home.searchPlaceholder': 'Search demo user',",
      '}',
    ].join('\n'),
  )
  writeFile(
    sharedConstantsPath,
    [
      "export const LOCALE_STORAGE_KEY = 'repo-locale'",
      "export const FALLBACK_LOCALE = 'zh-CN'",
    ].join('\n'),
  )
  writeFile(
    themeInitPath,
    ['const preferenceKey = "repo-theme-preference";', 'const styleId = "repo-theme-style";'].join(
      '\n',
    ),
  )

  const result = applyTemplateInitialization({
    workspaceRoot,
    projectName: 'acme-starter',
    displayName: 'Acme Starter',
    storageKeyPrefix: 'acme-console',
    appTitle: 'Acme Control Center',
  })

  assert.equal(result.changedFiles.length, 4)
  assert.deepEqual(result.changedFiles.map((file) => file.replaceAll('\\', '/')).sort(), [
    'README.md',
    'apps/react-app/public/theme-init.js',
    'apps/react-app/src/i18n/messages.ts',
    'packages/shared/src/i18n/constants.ts',
  ])

  assert.match(readFileSync(readmePath, 'utf8'), /# Acme Starter/)
  assert.match(readFileSync(readmePath, 'utf8'), /Acme Starter/)
  assert.match(readFileSync(reactMessagesPath, 'utf8'), /Acme Starter \(React\)/)
  assert.match(readFileSync(reactMessagesPath, 'utf8'), /Search demo user/)
  assert.match(readFileSync(sharedConstantsPath, 'utf8'), /acme-console-locale/)
  assert.match(readFileSync(themeInitPath, 'utf8'), /acme-console-theme-preference/)
  assert.match(readFileSync(themeInitPath, 'utf8'), /acme-console-theme-style/)
})

test('applyTemplateInitialization keeps files unchanged when no known placeholders are present', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-init-template-'))
  const filePath = join(workspaceRoot, 'README.md')

  writeFile(filePath, '# already-customized')

  const result = applyTemplateInitialization({
    workspaceRoot,
    projectName: 'acme-starter',
    displayName: 'Acme Starter',
    storageKeyPrefix: 'acme-console',
    appTitle: 'Acme Control Center',
  })

  assert.deepEqual(result.changedFiles, [])
  assert.equal(readFileSync(filePath, 'utf8'), '# already-customized')
})
