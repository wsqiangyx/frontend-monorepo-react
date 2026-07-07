import type { ThemePreference, ThemeRuntimeState } from '@repo/shared-utils/theme'

export type { ThemePreference, ThemeRuntimeState } from '@repo/shared-utils/theme'

export interface PlatformThemeRuntime {
  getState(): ThemeRuntimeState
  setPreference(preference: ThemePreference): void
  subscribe(listener: (state: ThemeRuntimeState) => void): () => void
  apply(): void
}
