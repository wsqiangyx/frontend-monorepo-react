import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

import { checkTemplateResidue } from '../check-template-residue.mjs'

function writeFile(filePath, content) {
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, content)
}

test('checkTemplateResidue reports typical template and demo residue with file context', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'apps/react-app/src/i18n/messages.ts'),
    "'home.title': 'React Workspace Shell'\n'home.searchPlaceholder': 'Search demo user'\n",
  )
  writeFile(
    join(workspaceRoot, 'packages/shared-i18n/src/constants.ts'),
    "export const LOCALE_STORAGE_KEY = 'repo-locale'\n",
  )

  const result = checkTemplateResidue({ workspaceRoot })

  assert.equal(result.ok, false)
  assert.ok(result.issues.length >= 2)
  assert.match(result.message, /Template residue detected/)
  assert.match(
    result.message,
    /apps\/react-app\/src\/i18n\/messages\.ts|apps\\react-app\\src\\i18n\\messages\.ts/,
  )
  assert.match(result.message, /repo-locale/)
})

test('checkTemplateResidue passes when known residue patterns are absent', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'apps/react-app/src/i18n/messages.ts'),
    "'home.title': 'Acme Control Center'\n",
  )
  writeFile(
    join(workspaceRoot, 'packages/shared-i18n/src/constants.ts'),
    "export const LOCALE_STORAGE_KEY = 'acme-console-locale'\n",
  )
  writeFile(join(workspaceRoot, '.github/workflows/ci.yml'), 'branches: [main]\n')

  const result = checkTemplateResidue({ workspaceRoot })

  assert.equal(result.ok, true)
  assert.deepEqual(result.issues, [])
})

test('checkTemplateResidue ignores docs, template markdown, and scripts while keeping app package ci and root config residue', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(join(workspaceRoot, 'docs/教程/模板初始化与裁剪指南.md'), 'React Workspace Shell\n')
  writeFile(join(workspaceRoot, 'docs/专题文档/实施计划/路线图.md'), 'React Starter Shell\n')
  writeFile(join(workspaceRoot, 'TEMPLATE.md'), 'Search demo user\n')
  writeFile(join(workspaceRoot, '.github/PULL_REQUEST_TEMPLATE.md'), 'React Workspace Shell\n')
  writeFile(join(workspaceRoot, 'scripts/__tests__/fixture.test.mjs'), 'Search demo user\n')
  writeFile(join(workspaceRoot, 'scripts/example.mjs'), 'Search records\n')

  writeFile(
    join(workspaceRoot, 'apps/react-app/src/i18n/messages.ts'),
    "'home.title': 'React Starter Shell'\n",
  )
  writeFile(
    join(workspaceRoot, 'packages/shared-i18n/src/constants.ts'),
    "export const LOCALE_STORAGE_KEY = 'repo-locale'\n",
  )
  writeFile(
    join(workspaceRoot, 'package.json'),
    '{ "name": "acme-starter", "homepageTitle": "React Starter Shell" }\n',
  )

  const result = checkTemplateResidue({ workspaceRoot })
  const issueFiles = result.issues.map((issue) => issue.file.replaceAll('\\', '/'))

  assert.equal(result.ok, false)
  assert.ok(issueFiles.includes('apps/react-app/src/i18n/messages.ts'))
  assert.ok(issueFiles.includes('package.json'))

  assert.ok(!issueFiles.includes('docs/教程/模板初始化与裁剪指南.md'))
  assert.ok(!issueFiles.includes('docs/专题文档/实施计划/路线图.md'))
  assert.ok(!issueFiles.includes('TEMPLATE.md'))
  assert.ok(!issueFiles.includes('.github/PULL_REQUEST_TEMPLATE.md'))
  assert.ok(!issueFiles.includes('scripts/__tests__/fixture.test.mjs'))
  assert.ok(!issueFiles.includes('scripts/example.mjs'))
})

test('checkTemplateResidue detects @repo/* scope identifiers in code', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'packages/shared-utils/src/index.ts'),
    "export { default } from '@repo/shared-utils'\n",
  )
  writeFile(
    join(workspaceRoot, 'apps/react-app/src/main.tsx'),
    "import { createRoot } from '@repo/shared-utils'\n",
  )

  const result = checkTemplateResidue({ workspaceRoot })
  const issueLabels = result.issues.map((issue) => issue.label)

  assert.equal(result.ok, false)
  assert.ok(issueLabels.includes('template scope identifier'))
})

test('checkTemplateResidue detects repo-theme-preference in code', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'packages/design-tokens/src/theme.ts'),
    "export const THEME_KEY = 'repo-theme-preference'\n",
  )

  const result = checkTemplateResidue({ workspaceRoot })
  const issueLabels = result.issues.map((issue) => issue.label)

  assert.equal(result.ok, false)
  assert.ok(issueLabels.includes('template theme preference key'))
})

test('checkTemplateResidue detects repo-theme-style in code', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'packages/design-tokens/src/theme.ts'),
    "export const STYLE_KEY = 'repo-theme-style'\n",
  )

  const result = checkTemplateResidue({ workspaceRoot })
  const issueLabels = result.issues.map((issue) => issue.label)

  assert.equal(result.ok, false)
  assert.ok(issueLabels.includes('template theme style key'))
})

test('checkTemplateResidue detects repo-locale in code', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'packages/shared-i18n/src/constants.ts'),
    "export const LOCALE_KEY = 'repo-locale'\n",
  )

  const result = checkTemplateResidue({ workspaceRoot })
  const issueLabels = result.issues.map((issue) => issue.label)

  assert.equal(result.ok, false)
  assert.ok(issueLabels.includes('template locale key'))
})

test('checkTemplateResidue ignores @repo/* and repo-* in docs and templates', () => {
  const workspaceRoot = mkdtempSync(join(tmpdir(), 'repo-template-residue-'))

  writeFile(
    join(workspaceRoot, 'docs/教程/模板初始化与裁剪指南.md'),
    'You may want to replace @repo/* scope later.\n',
  )
  writeFile(
    join(workspaceRoot, 'TEMPLATE.md'),
    'Consider replacing repo-theme-preference with your own key.\n',
  )
  writeFile(join(workspaceRoot, 'README.md'), 'The default locale key is repo-locale.\n')

  const result = checkTemplateResidue({ workspaceRoot })

  assert.equal(result.ok, true)
  assert.deepEqual(result.issues, [])
})
