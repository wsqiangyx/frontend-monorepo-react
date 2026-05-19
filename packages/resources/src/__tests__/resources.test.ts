import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import packageJson from '../../package.json'
import { getSharedAssetUrl, sharedAssetManifest } from '../assets'
import { getIconUrl, iconManifest, isIconName } from '../icons'
import { getSvgUrl, svgManifest } from '../svg'
import { getSpriteHref, spriteManifest } from '../sprite'

const assetsSourceDir = dirname(fileURLToPath(new URL('../assets/index.ts', import.meta.url)))
const iconsSourceDir = dirname(fileURLToPath(new URL('../icons/index.ts', import.meta.url)))
const svgSourceDir = dirname(fileURLToPath(new URL('../svg/index.ts', import.meta.url)))
const spriteSourceDir = dirname(fileURLToPath(new URL('../sprite/index.ts', import.meta.url)))

describe('@repo/resources', () => {
  it('exposes only the approved resource entrypoints via package exports', () => {
    expect(Object.keys(packageJson.exports)).toEqual([
      '.',
      './assets',
      './icons',
      './svg',
      './sprite',
    ])
  })

  it('resolves shared asset urls from the assets manifest', () => {
    expect(sharedAssetManifest.workspaceGrid.relativePath).toBe('./images/workspace-grid.svg')
    expect(getSharedAssetUrl('workspaceGrid')).toContain('/assets/images/workspace-grid.svg')
  })

  it('resolves icon urls from the icon manifest', () => {
    expect(iconManifest.workspaceShell.relativePath).toBe('../assets/icons/workspace-shell.svg')
    expect(isIconName('workspaceShell')).toBe(true)
    expect(getIconUrl('workspaceShell')).toContain('/assets/icons/workspace-shell.svg')
  })

  it('resolves svg illustration urls from the svg manifest', () => {
    expect(svgManifest.insightPanel.relativePath).toBe('../assets/svg/insight-panel.svg')
    expect(getSvgUrl('insightPanel')).toContain('/assets/svg/insight-panel.svg')
  })

  it('creates sprite hrefs with stable symbol ids', () => {
    expect(spriteManifest.workspaceMark.filePath).toBe('../assets/sprites/workspace-sprite.svg')
    expect(getSpriteHref('workspaceMark')).toContain(
      '/assets/sprites/workspace-sprite.svg#repo-workspace-mark',
    )
  })

  it('keeps every manifest entry aligned with a real source asset file', () => {
    const manifestFileEntries = [
      ...Object.values(sharedAssetManifest).map((entry) => ({
        baseDir: assetsSourceDir,
        relativePath: entry.relativePath,
      })),
      ...Object.values(iconManifest).map((entry) => ({
        baseDir: iconsSourceDir,
        relativePath: entry.relativePath,
      })),
      ...Object.values(svgManifest).map((entry) => ({
        baseDir: svgSourceDir,
        relativePath: entry.relativePath,
      })),
      ...Object.values(spriteManifest).map((entry) => ({
        baseDir: spriteSourceDir,
        relativePath: entry.filePath,
      })),
    ]

    for (const { baseDir, relativePath } of manifestFileEntries) {
      const absoluteFilePath = resolve(baseDir, relativePath)
      expect(
        existsSync(absoluteFilePath),
        `Missing resource file referenced by manifest: ${relativePath}`,
      ).toBe(true)
    }
  })
})
