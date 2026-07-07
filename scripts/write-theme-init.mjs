// ============================================================================
// write-theme-init.mjs — 生成 theme-init.js（首屏主题预注入脚本）
// ============================================================================
// 【过渡方案】本脚本自包含 token 数据，未能直接复用 @repo/design-tokens 的正式导出。
//
// 原因：tsconfig.base.json 使用 moduleResolution: "bundler"，编译产物中的
// 相对导入缺少 .js 扩展名，Node.js ESM 无法直接加载 dist 文件。
//
// 当前一致性保障：通过 packages/design-tokens/src/__tests__/theme-init-consistency.test.ts
// 在 vitest 环境下比对本脚本与 ui-tokens 源码的 getThemeInitScript() 输出。
//
// 收敛前提（任一即可）：
//   1. 将 moduleResolution 改为 "node16"/"nodenext"（影响全仓，需单独评估）
//   2. 在构建流程中用 esbuild/rollup 将 ui-tokens theme 模块打包为自包含 bundle
//   3. 将 token 数据提取为纯 JSON，由本脚本和 ui-tokens 共同消费
// ============================================================================
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const colors = {
  primary: '#1677ff',
  primaryHover: '#4096ff',
  primaryPressed: '#0958d9',
  primaryScale: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff',
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },
  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
  info: '#1677ff',
  secondary: '#64748b',
  secondaryHover: '#475569',
  secondaryPressed: '#334155',
  accent: '#8b5cf6',
  accentHover: '#7c3aed',
  accentPressed: '#6d28d9',
  destructive: '#ef4444',
  destructiveHover: '#dc2626',
  destructivePressed: '#b91c1c',
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e8e8e8',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.88)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    tertiary: 'rgba(0, 0, 0, 0.45)',
    quaternary: 'rgba(0, 0, 0, 0.25)',
  },
  bg: {
    default: '#ffffff',
    container: '#ffffff',
    elevated: '#ffffff',
    spotlight: '#f5f5f5',
    hover: 'rgba(0, 0, 0, 0.04)',
    pressed: 'rgba(0, 0, 0, 0.08)',
    selected: 'rgba(22, 119, 255, 0.08)',
  },
  border: {
    default: '#d9d9d9',
    secondary: '#f0f0f0',
    hover: '#bfbfbf',
    focus: '#1677ff',
  },
}

const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
}

const typography = {
  fontFamily: {
    base: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    code: "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
}

const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
}

const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
}

const radius = {
  none: '0px',
  sm: '2px',
  base: '4px',
  md: '6px',
  lg: '8px',
  xl: '12px',
  '2xl': '16px',
  full: '9999px',
}

const motion = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },
}

const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  overlay: 1040,
  drawer: 1050,
  modal: 1060,
  popover: 1070,
  toast: 1080,
  tooltip: 1090,
}

const opacity = {
  hover: 0.08,
  pressed: 0.12,
  disabled: 0.4,
  placeholder: 0.45,
  overlay: 0.5,
  backdrop: 0.8,
}

const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  normal: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  color: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  transform: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  shadow: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  fade: '150ms cubic-bezier(0, 0, 0.2, 1)',
  slide: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  scale: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
}

const shadcnCssBridgeVars = {
  '--background': 'var(--theme-color-bg-page)',
  '--foreground': 'var(--theme-color-text-primary)',
  '--card': 'var(--theme-color-bg-card)',
  '--card-foreground': 'var(--theme-color-text-primary)',
  '--popover': 'var(--theme-color-bg-elevated)',
  '--popover-foreground': 'var(--theme-color-text-primary)',
  '--primary': 'var(--theme-color-brand-primary)',
  '--primary-foreground': '#ffffff',
  '--secondary': 'var(--theme-color-bg-card)',
  '--secondary-foreground': 'var(--theme-color-text-primary)',
  '--muted': 'var(--theme-color-bg-card)',
  '--muted-foreground': 'var(--theme-color-text-secondary)',
  '--accent': 'var(--theme-color-bg-hover)',
  '--accent-foreground': 'var(--theme-color-text-primary)',
  '--destructive': 'var(--theme-color-destructive)',
  '--destructive-foreground': '#ffffff',
  '--border': 'var(--theme-color-border)',
  '--input': 'var(--theme-color-border)',
  '--ring': 'var(--theme-color-border-focus)',
  '--radius': 'var(--theme-radius-md)',
}

// ---------------------------------------------------------------------------
// Theme snapshots
// ---------------------------------------------------------------------------

const defaultLightTheme = {
  name: 'default',
  mode: 'light',
  colorBgPage: colors.bg.default,
  colorBgCard: colors.bg.container,
  colorBgElevated: colors.bg.elevated,
  colorTextPrimary: colors.text.primary,
  colorTextSecondary: colors.text.secondary,
  colorTextMuted: colors.text.tertiary,
  colorBorder: colors.border.default,
  colorBorderStrong: colors.neutral[400],
  colorBrandPrimary: colors.primary,
  colorBrandPrimaryHover: colors.primaryHover,
  colorBrandPrimaryActive: colors.primaryPressed,
  colorSuccess: colors.success,
  colorWarning: colors.warning,
  colorError: colors.error,
  colorInfo: colors.info,
  shadowPanel: shadows.base,
  shadowRaised: shadows.lg,
  radiusSm: radius.sm,
  radiusMd: radius.md,
  radiusLg: radius.lg,
  spacingPanelX: '24px',
  spacingPanelY: '24px',
  colorBgHover: 'rgba(0, 0, 0, 0.04)',
  colorBgPressed: 'rgba(0, 0, 0, 0.08)',
  colorBgSelected: 'rgba(22, 119, 255, 0.08)',
  colorBorderHover: '#bfbfbf',
  colorBorderFocus: '#1677ff',
  colorDestructive: '#ef4444',
  colorDestructiveHover: '#dc2626',
  colorDestructivePressed: '#b91c1c',
}

const compactLightTheme = {
  ...defaultLightTheme,
  name: 'compact',
  spacingPanelX: '16px',
  spacingPanelY: '16px',
  radiusSm: '1px',
  radiusMd: '3px',
  radiusLg: '4px',
}

// ---------------------------------------------------------------------------
// deriveDarkFromLight — inline JS version matching derive-dark.ts logic
// ---------------------------------------------------------------------------

function deriveDarkFromLight(light) {
  return {
    ...light,
    mode: 'dark',

    // Backgrounds: move to neutral dark values
    colorBgPage: '#141414',
    colorBgCard: '#1f1f1f',
    colorBgElevated: '#262626',

    // Text: invert hierarchy
    colorTextPrimary: '#e8e8e8',
    colorTextSecondary: '#bfbfbf',
    colorTextMuted: '#8c8c8c',

    // Border: use neutral mid-dark
    colorBorder: '#434343',
    colorBorderStrong: '#595959',

    // Brand: keep primary, brighten hover
    colorBrandPrimary: light.colorBrandPrimary,
    colorBrandPrimaryHover: '#69b1ff',
    colorBrandPrimaryActive: light.colorBrandPrimaryActive,

    // Semantic colors: brighten 15-20% for dark background contrast
    colorSuccess: '#73d13d',
    colorWarning: '#ffc53d',
    colorError: '#ff7875',
    colorInfo: '#69b1ff',

    // Interaction states: invert overlay direction
    colorBgHover: 'rgba(255, 255, 255, 0.08)',
    colorBgPressed: 'rgba(255, 255, 255, 0.12)',
    colorBgSelected: 'rgba(22, 119, 255, 0.16)',
    colorBorderHover: '#434343',
    colorBorderFocus: '#69b1ff',

    // Destructive: same absolute values in both modes
    colorDestructive: light.colorDestructive,
    colorDestructiveHover: light.colorDestructiveHover,
    colorDestructivePressed: light.colorDestructivePressed,

    // Shadows: increase opacity for visibility on dark backgrounds
    shadowPanel: '0 1px 2px 0 rgba(0, 0, 0, 0.35), 0 1px 3px 0 rgba(0, 0, 0, 0.25)',
    shadowRaised: '0 4px 12px 0 rgba(0, 0, 0, 0.35), 0 2px 6px 0 rgba(0, 0, 0, 0.25)',
  }
}

// ---------------------------------------------------------------------------
// Theme registry
// ---------------------------------------------------------------------------

const themeRegistry = {
  default: {
    light: defaultLightTheme,
    dark: deriveDarkFromLight(defaultLightTheme),
  },
  compact: {
    light: compactLightTheme,
    dark: deriveDarkFromLight(compactLightTheme),
  },
}

const DEFAULT_THEME_NAME = 'default'
const DEFAULT_THEME_PREFERENCE = 'system'
const THEME_PREFERENCE_STORAGE_KEY = 'repo-theme-preference'
const THEME_STYLE_ID = 'repo-theme-style'

function toKebabCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function flattenTokens(obj, prefix = '') {
  const result = {}

  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = toKebabCase(key)
    const varName = prefix ? `${prefix}-${normalizedKey}` : normalizedKey

    if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTokens(value, varName))
    } else {
      result[varName] = String(value)
    }
  }

  return result
}

function resolveTheme(themeName, mode) {
  const safeThemeName = themeRegistry[themeName] ? themeName : DEFAULT_THEME_NAME
  const safeMode = mode === 'dark' ? 'dark' : 'light'
  const definition = themeRegistry[safeThemeName] ?? themeRegistry[DEFAULT_THEME_NAME]

  return definition[safeMode] ?? themeRegistry[DEFAULT_THEME_NAME].light
}

function tokensToCssVars() {
  return flattenTokens({
    color: colors,
    spacing,
    font: typography,
    breakpoint: breakpoints,
    shadow: shadows,
    radius,
    motion,
    zIndex,
    opacity,
    transition: transitions,
  })
}

function themeSnapshotToCssVars(snapshot) {
  const vars = {}

  for (const [key, value] of Object.entries(snapshot)) {
    if (key === 'name' || key === 'mode') {
      continue
    }

    vars[`theme-${toKebabCase(key)}`] = String(value)
  }

  return vars
}

function generateCssVarsString(snapshot) {
  const baseVars = snapshot
    ? { ...tokensToCssVars(), ...themeSnapshotToCssVars(snapshot) }
    : tokensToCssVars()
  // When a theme snapshot is provided, append shadcn/ui bridge variables
  // that reference --theme-* runtime variables for automatic theme switching
  const vars = snapshot ? { ...baseVars, ...shadcnCssBridgeVars } : baseVars
  const lines = Object.entries(vars).map(([key, value]) => `  --${key}: ${value};`)

  return `:root {\n${lines.join('\n')}\n}`
}

export function getThemeInitScript(input = {}) {
  const themeName = input.themeName ?? DEFAULT_THEME_NAME
  const payload = {
    themeName,
    defaultPreference: input.defaultPreference ?? DEFAULT_THEME_PREFERENCE,
    cssByMode: {
      light: generateCssVarsString(resolveTheme(themeName, 'light')),
      dark: generateCssVarsString(resolveTheme(themeName, 'dark')),
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

export function writeThemeInitFile(outputPath, input) {
  const absoluteOutputPath = resolve(outputPath)

  mkdirSync(dirname(absoluteOutputPath), { recursive: true })
  writeFileSync(absoluteOutputPath, getThemeInitScript(input))
}

const cliArgv = globalThis.process?.argv ?? []
const cliEntry = cliArgv[1]
const isDirectExecution = cliEntry && import.meta.url === pathToFileURL(resolve(cliEntry)).href

if (isDirectExecution) {
  const cliOutputPath = cliArgv[2] ?? resolve('.', 'public/theme-init.js')

  writeThemeInitFile(cliOutputPath)
}
