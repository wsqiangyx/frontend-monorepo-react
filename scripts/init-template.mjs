import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { relative, resolve, extname, join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createInterface } from 'node:readline'
import { execSync } from 'node:child_process'

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

function ensureRequiredOption(value, name) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Missing required option: ${name}`)
  }

  return value.trim()
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

function createGlobalReplacementPairs(options) {
  const projectName = ensureRequiredOption(options.projectName, 'projectName')
  const displayName = ensureRequiredOption(options.displayName, 'displayName')
  const storageKeyPrefix = ensureRequiredOption(options.storageKeyPrefix, 'storageKeyPrefix')
  ensureRequiredOption(options.appTitle, 'appTitle')

  return [
    ['frontend-monorepo', projectName],
    ['Frontend Monorepo', displayName],
    ['前端 Monorepo', displayName],
    ['React Workspace Shell', `${displayName} (React)`],
    ['Workspace Shell', displayName],
    ['React 工作台壳', `${displayName}（React）`],
    ['repo-theme-preference', `${storageKeyPrefix}-theme-preference`],
    ['repo-theme-style', `${storageKeyPrefix}-theme-style`],
    ['repo-locale', `${storageKeyPrefix}-locale`],
  ]
}

function createPathSpecificReplacementPairs(filePath, options) {
  const normalizedPath = filePath.replaceAll('\\', '/')
  const appTitle = ensureRequiredOption(options.appTitle, 'appTitle')
  const displayName = ensureRequiredOption(options.displayName, 'displayName')

  if (normalizedPath.endsWith('.html')) {
    return [
      ['<title>Frontend Monorepo</title>', `<title>${appTitle}</title>`],
      ['<title>React Workspace Shell</title>', `<title>${appTitle} - React</title>`],
    ]
  }

  if (normalizedPath.includes('/src/i18n/messages.')) {
    return [['React Workspace Shell', `${displayName} (React)`]]
  }

  if (normalizedPath.endsWith('README.md')) {
    return [
      ['# frontend-monorepo', `# ${displayName}`],
      ['面向团队复用的前端 monorepo Git 模板仓库', `基于 ${displayName} 的前端 monorepo 工程`],
    ]
  }

  return []
}

function replaceAllKnownPlaceholders(content, replacementPairs) {
  let nextContent = content

  for (const [searchValue, replaceValue] of replacementPairs) {
    nextContent = nextContent.split(searchValue).join(replaceValue)
  }

  return nextContent
}

function checkUncommittedChanges(workspaceRoot) {
  try {
    const output = execSync('git status --porcelain', {
      cwd: workspaceRoot,
      encoding: 'utf8',
    }).trim()
    return output.length > 0
  } catch {
    return false
  }
}

async function promptForOptions(defaults) {
  const rl = createInterface({ input: globalThis.process.stdin, output: globalThis.process.stdout })
  const ask = (question, defaultValue) =>
    new Promise((resolve) => {
      const suffix = defaultValue ? ` [${defaultValue}]` : ''
      rl.question(`${question}${suffix}: `, (answer) => {
        resolve(answer.trim() || defaultValue || '')
      })
    })

  globalThis.console.log('\n=== 模板初始化配置 ===\n')

  const projectName =
    (await ask('项目名称 (kebab-case)', defaults.projectName)) || defaults.projectName
  const displayName = (await ask('项目展示名称', defaults.displayName)) || defaults.displayName
  const storageKeyPrefix =
    (await ask('持久化 key 前缀', defaults.storageKeyPrefix)) || defaults.storageKeyPrefix
  const appTitle = (await ask('App 标题', defaults.appTitle)) || defaults.appTitle

  rl.close()

  return { projectName, displayName, storageKeyPrefix, appTitle }
}

export function applyTemplateInitialization(input) {
  const workspaceRoot = resolve(ensureRequiredOption(input.workspaceRoot, 'workspaceRoot'))
  const globalReplacementPairs = createGlobalReplacementPairs(input)
  const files = walkTextFiles(workspaceRoot)
  const changedFiles = []
  const changeSummary = []

  for (const filePath of files) {
    const originalContent = readFileSync(filePath, 'utf8')
    const pathSpecific = createPathSpecificReplacementPairs(filePath, input)
    const nextContent = replaceAllKnownPlaceholders(
      replaceAllKnownPlaceholders(originalContent, pathSpecific),
      globalReplacementPairs,
    )

    if (nextContent === originalContent) {
      continue
    }

    if (input.dryRun) {
      changeSummary.push({
        file: relative(workspaceRoot, filePath),
        changes: [...pathSpecific, ...globalReplacementPairs].filter(([s]) =>
          originalContent.includes(s),
        ),
      })
      changedFiles.push(relative(workspaceRoot, filePath))
      continue
    }

    writeFileSync(filePath, nextContent)
    changedFiles.push(relative(workspaceRoot, filePath))
  }

  let message = input.dryRun
    ? `[DRY RUN] Would modify ${changedFiles.length} file(s):\n`
    : changedFiles.length === 0
      ? 'No known template placeholders were updated.'
      : `Updated ${changedFiles.length} file(s).`

  if (input.dryRun) {
    for (const change of changeSummary) {
      message += `\n  ${change.file}:`
      for (const [search, replace] of change.changes) {
        message += `\n    "${search}" -> "${replace}"`
      }
    }
  } else if (changedFiles.length > 0) {
    message += '\n\nModified files:'
    for (const file of changedFiles) {
      message += `\n  - ${file}`
    }
  }

  return { changedFiles, message }
}

function parseCliArgs(argv) {
  const result = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]

    if (arg === '--dry-run') {
      result['dry-run'] = true
      continue
    }

    if (arg === '--yes') {
      result.yes = true
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
  const workspaceRoot = cliOptions.root ?? '.'
  const isDryRun = cliOptions['dry-run'] === true
  const skipConfirm = cliOptions.yes === true

  const defaults = {
    projectName: 'my-project',
    displayName: 'My Project',
    storageKeyPrefix: 'my',
    appTitle: 'My App',
  }

  const hasAllOptions =
    cliOptions['project-name'] &&
    cliOptions['display-name'] &&
    cliOptions['storage-key-prefix'] &&
    cliOptions['app-title']

  let options

  if (hasAllOptions) {
    options = {
      workspaceRoot,
      projectName: cliOptions['project-name'],
      displayName: cliOptions['display-name'],
      storageKeyPrefix: cliOptions['storage-key-prefix'],
      appTitle: cliOptions['app-title'],
      dryRun: isDryRun,
    }
  } else if (isDryRun) {
    options = {
      workspaceRoot,
      ...defaults,
      dryRun: true,
    }
  } else {
    const prompted = await promptForOptions(defaults)
    options = { workspaceRoot, ...prompted }

    if (!skipConfirm) {
      const rl = createInterface({
        input: globalThis.process.stdin,
        output: globalThis.process.stdout,
      })
      const answer = await new Promise((resolve) => {
        rl.question('\n确认执行以上替换？(y/N) ', (a) => resolve(a.trim().toLowerCase()))
        rl.close()
      })

      if (answer !== 'y' && answer !== 'yes') {
        globalThis.console.log('已取消操作。')
        globalThis.process.exit(0)
      }
    }
  }

  const resolvedRoot = resolve(options.workspaceRoot)
  const hasChanges = await checkUncommittedChanges(resolvedRoot)

  if (hasChanges && !isDryRun) {
    globalThis.console.warn('\n警告：检测到未提交的修改，建议先提交或暂存后再执行初始化。')
    if (!skipConfirm) {
      const rl = createInterface({
        input: globalThis.process.stdin,
        output: globalThis.process.stdout,
      })
      const answer = await new Promise((resolve) => {
        rl.question('是否继续？(y/N) ', (a) => resolve(a.trim().toLowerCase()))
        rl.close()
      })

      if (answer !== 'y' && answer !== 'yes') {
        globalThis.console.log('已取消操作。')
        globalThis.process.exit(0)
      }
    }
  }

  const result = applyTemplateInitialization(options)
  globalThis.console.log(result.message)
}
