export const iconManifest = {
  workspaceShell: {
    relativePath: '../assets/icons/workspace-shell.svg',
    alt: 'Workspace shell icon',
  },
} as const

export type IconName = keyof typeof iconManifest

export function isIconName(name: string): name is IconName {
  return name in iconManifest
}

export function getIconUrl(name: IconName): string {
  return new URL(iconManifest[name].relativePath, import.meta.url).href
}
