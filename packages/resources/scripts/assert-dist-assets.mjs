import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageDir = resolve(scriptDir, '..')
const sourceRoot = resolve(packageDir, 'src/assets')
const distRoot = resolve(packageDir, 'dist/assets')
const staticAssetExtensions = new Set([
  '.svg',
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.avif',
  '.ico',
  '.woff',
  '.woff2',
  '.ttf',
  '.otf',
])

function collectFiles(rootDir, currentDir = rootDir) {
  const entries = readdirSync(currentDir)

  return entries.flatMap((entry) => {
    const absolutePath = resolve(currentDir, entry)
    const entryStats = statSync(absolutePath)

    if (entryStats.isDirectory()) {
      return collectFiles(rootDir, absolutePath)
    }

    return [relative(rootDir, absolutePath)]
  })
}

const sourceFiles = existsSync(sourceRoot)
  ? collectFiles(sourceRoot).filter((relativeFile) => {
      const extension = relativeFile.slice(relativeFile.lastIndexOf('.'))
      return staticAssetExtensions.has(extension)
    })
  : []
const missingFiles = sourceFiles.filter(
  (relativeFile) => !existsSync(resolve(distRoot, relativeFile)),
)

if (missingFiles.length > 0) {
  throw new Error(`Missing copied resource assets:\n${missingFiles.join('\n')}`)
}
