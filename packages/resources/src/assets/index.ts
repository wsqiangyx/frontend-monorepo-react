export const sharedAssetManifest = {
  workspaceGrid: {
    relativePath: './images/workspace-grid.svg',
    alt: 'Workspace grid illustration',
  },
} as const

export type SharedAssetName = keyof typeof sharedAssetManifest

export function getSharedAssetUrl(name: SharedAssetName): string {
  return new URL(sharedAssetManifest[name].relativePath, import.meta.url).href
}
