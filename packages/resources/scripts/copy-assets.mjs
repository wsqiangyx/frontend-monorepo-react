import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageDir = resolve(scriptDir, '..')
const targetDir = resolve(packageDir, 'dist/assets')
const assetSourceDir = resolve(packageDir, 'src/assets')

const assetFolders = existsSync(assetSourceDir)
  ? readdirSync(assetSourceDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : []

mkdirSync(targetDir, { recursive: true })

for (const folder of assetFolders) {
  const sourceDir = resolve(assetSourceDir, folder)
  const folderTargetDir = resolve(targetDir, folder)

  if (!existsSync(sourceDir)) {
    continue
  }

  mkdirSync(folderTargetDir, { recursive: true })
  cpSync(sourceDir, folderTargetDir, { recursive: true, force: true })
}
