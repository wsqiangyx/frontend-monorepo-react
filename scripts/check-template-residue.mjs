import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const TEXT_FILE_EXTENSIONS = new Set([
  '.md',
  '.txt',
  '.json',
  '.yml',
  '.yaml',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.scss',
  '.html',
])

const SKIP_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'coverage'])
const INCLUDED_ROOT_FILES = new Set([
  'package.json',
  'pnpm-workspace.yaml',
  'pnpm-lock.yaml',
  'eslint.config.js',
  'vitest.config.ts',
  'tsconfig.json',
  'tsconfig.base.json',
  'tsconfig.node.json',
  'stylelint.config.js',
  'stylelint.config.cjs',
  'prettier.config.js',
  'prettier.config.cjs',
  'commitlint.config.cjs',
  'uno.config.ts',
  'uno.config.js',
])

const RESIDUE_RULES = [
  { label: 'workspace shell title', pattern: /React?\s*Workspace Shell/g },
  { label: 'starter shell title', pattern: /React?\s*Starter Shell/g },
  { label: 'demo search placeholder', pattern: /Search demo user/g },
  { label: 'demo mock badge', pattern: /Mock 已就绪/g },
  { label: 'workspace shell title (CN)', pattern: /React?\s*工作台壳/g },
  { label: 'template scope identifier', pattern: /@repo\//g },
  { label: 'template theme preference key', pattern: /repo-theme-preference/g },
  { label: 'template theme style key', pattern: /repo-theme-style/g },
  { label: 'template locale key', pattern: /repo-locale/g },
]

const FIX_SUGGESTIONS = {
  'workspace shell title': 'Replace "Workspace Shell" titles with your app name',
  'starter shell title': 'Replace "Starter Shell" titles with your app name',
  'workspace shell title (CN)': 'Replace "工作台壳" titles with your app name',
  'demo search placeholder': 'Replace "Search demo user" with your placeholder',
  'demo mock badge': 'Replace "Mock 已就绪" with your badge text',
  'template scope identifier': 'Replace @repo/* with your own package scope',
  'template theme preference key': 'Replace repo-theme-preference with your own key',
  'template theme style key': 'Replace repo-theme-style with your own key',
  'template locale key': 'Replace repo-locale with your own key',
}

function ensureWorkspaceRoot(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error('Missing required option: workspaceRoot')
  }

  return resolve(value.trim())
}

function walkTextFiles(rootDir) {
  const queue = [rootDir]
  const files = []

  while (queue.length > 0) {
    const currentDir = queue.shift()

    for (const entry of readdirSync(currentDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!SKIP_DIRECTORIES.has(entry.name)) {
          queue.push(join(currentDir, entry.name))
        }

        continue
      }

      const filePath = join(currentDir, entry.name)

      if (!statSync(filePath).isFile()) {
        continue
      }

      if (TEXT_FILE_EXTENSIONS.has(extname(entry.name))) {
        files.push(filePath)
      }
    }
  }

  return files
}

const SKIP_INSPECTION_PATHS = [
  'docs/',
  'README.md',
  'TEMPLATE.md',
  'AGENTS.md',
  'CHANGELOG.md',
  'scripts/__tests__/',
  '.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/',
]

function shouldInspectFile(rootDir, filePath) {
  const relativePath = relative(rootDir, filePath).replaceAll('\\', '/')

  // 跳过文档和说明性文件，避免误伤
  for (const skipPath of SKIP_INSPECTION_PATHS) {
    if (relativePath.startsWith(skipPath) || relativePath === skipPath) {
      return false
    }
  }

  // 优先检查 .github/workflows/ 目录
  if (relativePath.startsWith('.github/workflows/')) {
    return true
  }

  if (relativePath.startsWith('apps/') || relativePath.startsWith('packages/')) {
    return true
  }

  if (relativePath.includes('/')) {
    return false
  }

  return INCLUDED_ROOT_FILES.has(relativePath)
}

function buildMessage(issues, dryRun) {
  if (issues.length === 0) {
    return 'No known template residue detected.'
  }

  const lines = dryRun
    ? ['Template residue detected (suggestions):']
    : ['Template residue detected:']

  for (const issue of issues) {
    const suggestion = FIX_SUGGESTIONS[issue.label] ? ` (${FIX_SUGGESTIONS[issue.label]})` : ''
    lines.push(`- ${issue.file}: ${issue.label} -> "${issue.match}"${suggestion}`)
  }

  return lines.join('\n')
}

export function checkTemplateResidue(input) {
  const workspaceRoot = ensureWorkspaceRoot(input.workspaceRoot)
  const dryRun = input.fix === true
  const issues = []

  for (const filePath of walkTextFiles(workspaceRoot)) {
    if (!shouldInspectFile(workspaceRoot, filePath)) {
      continue
    }

    const content = readFileSync(filePath, 'utf8')
    const relativePath = relative(workspaceRoot, filePath)

    for (const rule of RESIDUE_RULES) {
      const matches = content.matchAll(rule.pattern)

      for (const match of matches) {
        issues.push({
          file: relativePath,
          label: rule.label,
          match: match[0],
        })
      }
    }
  }

  return {
    ok: issues.length === 0,
    issues,
    message: buildMessage(issues, dryRun),
  }
}

function parseCliArgs(argv) {
  const result = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--fix') {
      result.fix = true
      continue
    }

    if (arg === '--no-fail') {
      result.noFail = true
      continue
    }

    if (!arg.startsWith('--')) {
      continue
    }

    const key = arg.slice(2)
    const value = argv[index + 1]

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for argument: ${arg}`)
    }

    result[key] = value
    index += 1
  }

  return result
}

const cliArgv = globalThis.process?.argv ?? []
const cliEntry = cliArgv[1]
const isDirectExecution = cliEntry && import.meta.url === pathToFileURL(resolve(cliEntry)).href

if (isDirectExecution) {
  const cliOptions = parseCliArgs(cliArgv.slice(2))
  const workspaceRoot = cliArgv[2] ?? '.'
  const result = checkTemplateResidue({ workspaceRoot, fix: cliOptions.fix })

  if (result.ok) {
    globalThis.console.log(result.message)
  } else {
    globalThis.console.error(result.message)
    if (!cliOptions.noFail) {
      globalThis.process.exitCode = 1
    }
  }
}
