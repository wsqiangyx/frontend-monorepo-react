import { type ThemeMode, type ThemeName } from '@repo/shared/ui-contract'
import { generateCssVarsString } from '../to-css'
import { resolveTheme } from './registry'

export type ThemePreference = ThemeMode | 'system'

export interface ThemeRuntimeState {
  themeName: ThemeName
  preference: ThemePreference
  resolvedMode: ThemeMode
}

const THEME_PREFERENCE_STORAGE_KEY = 'repo-theme-preference'
const DEFAULT_THEME_NAME: ThemeName = 'default'
const DEFAULT_THEME_PREFERENCE: ThemePreference = 'system'
const THEME_STYLE_ID = 'repo-theme-style'

interface ThemeInitPayload {
  themeName: ThemeName
  defaultPreference: ThemePreference
  cssByMode: Record<ThemeMode, string>
}

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function resolveInitialThemeMode(input?: {
  storedMode?: unknown
  systemDark?: boolean
}): ThemeMode {
  if (input?.storedMode === 'light' || input?.storedMode === 'dark') {
    return input.storedMode
  }

  if (input?.systemDark) {
    return 'dark'
  }

  return 'light'
}

export function resolveThemeMode(
  preference: ThemePreference,
  systemMode: ThemeMode = 'light',
): ThemeMode {
  if (preference === 'system') {
    return systemMode
  }

  return preference
}

export function detectSystemThemeMode(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function getStoredThemePreference(): ThemePreference | null {
  try {
    if (typeof localStorage === 'undefined') {
      return null
    }

    const value = localStorage.getItem(THEME_PREFERENCE_STORAGE_KEY)

    return isThemePreference(value) ? value : null
  } catch {
    return null
  }
}

export function setStoredThemePreference(preference: ThemePreference): void {
  try {
    if (typeof localStorage === 'undefined') {
      return
    }

    localStorage.setItem(THEME_PREFERENCE_STORAGE_KEY, preference)
  } catch {
    // Ignore storage failures and keep runtime state usable.
  }
}

export function createThemeRuntimeState(input?: {
  themeName?: ThemeName
  defaultPreference?: ThemePreference
}): ThemeRuntimeState {
  const themeName = input?.themeName ?? DEFAULT_THEME_NAME
  const preference =
    getStoredThemePreference() ?? input?.defaultPreference ?? DEFAULT_THEME_PREFERENCE
  const resolvedMode = resolveThemeMode(preference, detectSystemThemeMode())

  return {
    themeName,
    preference,
    resolvedMode,
  }
}

export function applyThemeToDocument(state: ThemeRuntimeState): void {
  const documentNode = globalThis.document

  if (!documentNode) {
    return
  }

  let styleNode = documentNode.getElementById(THEME_STYLE_ID)

  if (!styleNode) {
    styleNode = documentNode.createElement('style')
    styleNode.id = THEME_STYLE_ID
    documentNode.head.appendChild(styleNode)
  }

  styleNode.textContent = generateCssVarsString(resolveTheme(state.themeName, state.resolvedMode))
  documentNode.documentElement.dataset.themeName = state.themeName
  documentNode.documentElement.dataset.themeMode = state.resolvedMode
  documentNode.documentElement.dataset.themePreference = state.preference
  documentNode.documentElement.classList.toggle('dark', state.resolvedMode === 'dark')
}

export function getThemeInitScript(input?: {
  themeName?: ThemeName
  defaultPreference?: ThemePreference
}): string {
  const payload: ThemeInitPayload = {
    themeName: input?.themeName ?? DEFAULT_THEME_NAME,
    defaultPreference: input?.defaultPreference ?? DEFAULT_THEME_PREFERENCE,
    cssByMode: {
      light: generateCssVarsString(resolveTheme(input?.themeName ?? DEFAULT_THEME_NAME, 'light')),
      dark: generateCssVarsString(resolveTheme(input?.themeName ?? DEFAULT_THEME_NAME, 'dark')),
    },
  }

  return `(() => {
  const payload = ${JSON.stringify(payload)};
  const preferenceKey = ${JSON.stringify(THEME_PREFERENCE_STORAGE_KEY)};
  const styleId = ${JSON.stringify(THEME_STYLE_ID)};

  try {
    const documentNode = globalThis.document;

    if (!documentNode) {
      return;
    }

    let preference = payload.defaultPreference;

    try {
      const storedPreference = globalThis.localStorage?.getItem(preferenceKey);

      if (storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system') {
        preference = storedPreference;
      }
    } catch (error) {
      void error;
    }

    const systemDark = typeof globalThis.matchMedia === 'function'
      ? globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
    const resolvedMode = preference === 'system'
      ? (systemDark ? 'dark' : 'light')
      : preference;

    let styleNode = documentNode.getElementById(styleId);

    if (!styleNode) {
      styleNode = documentNode.createElement('style');
      styleNode.id = styleId;
      documentNode.head.appendChild(styleNode);
    }

    styleNode.textContent = payload.cssByMode[resolvedMode];
    documentNode.documentElement.dataset.themeName = payload.themeName;
    documentNode.documentElement.dataset.themeMode = resolvedMode;
    documentNode.documentElement.dataset.themePreference = preference;
    documentNode.documentElement.classList.toggle('dark', resolvedMode === 'dark');
  } catch (error) {
    void error;
  }
})();`
}

export function subscribeToSystemThemeChange(callback: (mode: ThemeMode) => void): () => void {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => {}
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const listener = (event: MediaQueryListEvent) => {
    callback(event.matches ? 'dark' : 'light')
  }

  mediaQuery.addEventListener('change', listener)

  return () => {
    mediaQuery.removeEventListener('change', listener)
  }
}
