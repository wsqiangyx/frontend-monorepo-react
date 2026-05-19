export const spriteManifest = {
  workspaceMark: {
    filePath: '../assets/sprites/workspace-sprite.svg',
    symbolId: 'repo-workspace-mark',
  },
} as const

export type SpriteName = keyof typeof spriteManifest

export function getSpriteHref(name: SpriteName): string {
  const sprite = spriteManifest[name]
  const spriteUrl = new URL(sprite.filePath, import.meta.url).href

  return `${spriteUrl}#${sprite.symbolId}`
}
