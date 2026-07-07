import { defaultLightTheme } from './types'
import type { ThemeSnapshot } from './types'

/**
 * Compact theme: same colors as default but tighter spacing and smaller radii.
 */
export const compactLightTheme: ThemeSnapshot = {
  ...defaultLightTheme,
  name: 'compact',
  spacingPanelX: '16px',
  spacingPanelY: '16px',
  radiusSm: '1px',
  radiusMd: '3px',
  radiusLg: '4px',
}
