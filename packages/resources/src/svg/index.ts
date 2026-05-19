export const svgManifest = {
  insightPanel: {
    relativePath: '../assets/svg/insight-panel.svg',
    alt: 'Insight panel illustration',
  },
} as const

export type SvgName = keyof typeof svgManifest

export function getSvgUrl(name: SvgName): string {
  return new URL(svgManifest[name].relativePath, import.meta.url).href
}
