# UI Theme Enhancement and Component Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the UI theme enhancement and component library as specified in the design document, including token expansion, shadcn/ui integration, and component showcase.

**Architecture:** Extend design-tokens with motion, zIndex, opacity, and transition modules; enhance color system with scale, secondary/accent/destructive colors, and interactive states; implement dark theme derivation and compact theme variant; set up shadcn/ui infrastructure in shared-ui; create tiered component library; build component showcase page in react-app.

**Tech Stack:** TypeScript, React 19, Tailwind CSS v4, shadcn/ui, Radix UI, CVA, clsx, tailwind-merge, Zustand, Vitest

## Status: ✅ ALL TASKS COMPLETED

Based on project exploration (2026-07-08), **all tasks in this plan have already been implemented**:

### Completed Items:

- ✅ **Design Token Expansion** - motion.ts, zIndex.ts, opacity.ts, transitions.ts all exist
- ✅ **Color System Enhancement** - primaryScale, secondary/accent/destructive, interactive states implemented
- ✅ **Dark Theme Derivation** - derive-dark.ts with direct mapping (not runtime calculation)
- ✅ **Compact Theme Variant** - compact.ts with tighter spacing and radii
- ✅ **ThemeSnapshot Expansion** - 38 semantic properties including interactive states
- ✅ **shadcn/ui CSS Variable Bridge** - shadcn-bridge.ts mapping 16 shadcn/ui variables to --theme-\* runtime vars
- ✅ **shadcn/ui Infrastructure** - cn(), components.json, path aliases all configured
- ✅ **Tier 1 Core Components** - Button, Input, Label, Card, Badge, Separator
- ✅ **Tier 2 Important Components** - Select, Checkbox, RadioGroup, Switch, Textarea, Dialog, AlertDialog, DropdownMenu, Tooltip, Popover, Table, Tabs
- ✅ **Tier 3 Advanced Components** - Avatar, Progress, ScrollArea, Accordion, Toast, Toggle, ToggleGroup, Collapsible, Slider, Pagination, Skeleton, AspectRatio
- ✅ **Component Showcase Page** - ComponentShowcaseView.tsx at /components route
- ✅ **Theme Store** - Zustand store with themeName, preference, mode, system sync
- ✅ **Testing** - 8 test suites for design-tokens, 7 test suites for shared-ui

### Potential Enhancement Areas (Not in Original Scope):

1. Business components still use `.repo-*` CSS classes (could migrate to Tailwind)
2. Missing Form component (react-hook-form integration)
3. Missing Drawer (vaul) and Command (cmdk) components (peer deps not installed)
4. Showcase page doesn't demonstrate custom business components
5. Global SCSS contains duplicate patterns that could use shared components

---

## Task 1: Design Token Expansion - Motion, zIndex, Opacity, Transitions

**Files:**

- Create: `packages/design-tokens/src/motion.ts`
- Create: `packages/design-tokens/src/z-index.ts`
- Create: `packages/design-tokens/src/opacity.ts`
- Create: `packages/design-tokens/src/transitions.ts`
- Modify: `packages/design-tokens/src/index.ts`
- Modify: `packages/design-tokens/src/to-css.ts`
- Modify: `packages/design-tokens/src/theme/tailwind.ts`
- Modify: `scripts/write-theme-init.mjs`

- [ ] **Step 1: Create motion.ts token module**

```typescript
export const motion = {
  duration: {
    fast: '150ms', // Micro-interactions: button press, switch toggle
    normal: '200ms', // Standard transitions: color change, expand/collapse
    slow: '300ms', // Complex animations: dialog open, page transition
    slower: '500ms', // Large animations: fullscreen expand, drag release
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)', // Standard easing
    in: 'cubic-bezier(0.4, 0, 1, 1)', // Element exit
    out: 'cubic-bezier(0, 0, 0.2, 1)', // Element enter
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // Symmetric in/out
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // Bounce
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Spring
  },
} as const
```

- [ ] **Step 2: Create z-index.ts token module**

```typescript
export const zIndex = {
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
} as const
```

- [ ] **Step 3: Create opacity.ts token module**

```typescript
export const opacity = {
  hover: 0.08, // Hover overlay
  pressed: 0.12, // Pressed overlay
  disabled: 0.4, // Disabled state
  placeholder: 0.45, // Placeholder
  overlay: 0.5, // Overlay mask
  backdrop: 0.8, // Dark backdrop
} as const
```

- [ ] **Step 4: Create transitions.ts (derived from motion)**

```typescript
import { motion } from './motion'

// Derived from motion tokens, not independently defined
// New presets only need duration and easing defined in motion
export const transitions = {
  fast: `${motion.duration.fast} ${motion.easing.default}`,
  normal: `${motion.duration.normal} ${motion.easing.default}`,
  slow: `${motion.duration.slow} ${motion.easing.default}`,
  color: `${motion.duration.normal} ${motion.easing.default}`,
  transform: `${motion.duration.normal} ${motion.easing.default}`,
  shadow: `${motion.duration.normal} ${motion.easing.default}`,
  fade: `${motion.duration.fast} ${motion.easing.out}`,
  slide: `${motion.duration.slow} ${motion.easing.default}`,
  scale: `${motion.duration.normal} ${motion.easing.default}`,
} as const
```

- [ ] **Step 5: Update index.ts exports**

Add to `packages/design-tokens/src/index.ts`:

```typescript
export * from './motion'
export * from './z-index'
export * from './opacity'
export * from './transitions'
```

- [ ] **Step 6: Update to-css.ts token generation**

Add new modules to `allTokens` in `packages/design-tokens/src/to-css.ts`:

```typescript
import { motion } from './motion'
import { zIndex } from './z-index'
import { opacity } from './opacity'
import { transitions } from './transitions'

// Add to allTokens object
const allTokens = {
  // ... existing tokens
  motion,
  zIndex,
  opacity,
  transitions,
}
```

- [ ] **Step 7: Update tailwind.ts preset**

Add Tailwind mappings in `packages/design-tokens/src/theme/tailwind.ts`:

```typescript
import { motion } from '../motion'
import { zIndex } from '../z-index'
import { opacity } from '../opacity'
import { transitions } from '../transitions'

// Add to createTailwindPreset()
const createTailwindPreset = () => ({
  // ... existing theme
  theme: {
    extend: {
      // ... existing extensions
      transitionDuration: {
        'motion-fast': motion.duration.fast,
        'motion-normal': motion.duration.normal,
        'motion-slow': motion.duration.slow,
        'motion-slower': motion.duration.slower,
      },
      transitionTimingFunction: {
        'motion-default': motion.easing.default,
        'motion-in': motion.easing.in,
        'motion-out': motion.easing.out,
        'motion-in-out': motion.easing.inOut,
        'motion-bounce': motion.easing.bounce,
        'motion-spring': motion.easing.spring,
      },
      zIndex: {
        'z-base': zIndex.base,
        'z-dropdown': zIndex.dropdown,
        'z-sticky': zIndex.sticky,
        'z-fixed': zIndex.fixed,
        'z-overlay': zIndex.overlay,
        'z-drawer': zIndex.drawer,
        'z-modal': zIndex.modal,
        'z-popover': zIndex.popover,
        'z-toast': zIndex.toast,
        'z-tooltip': zIndex.tooltip,
      },
      opacity: {
        'opacity-hover': opacity.hover,
        'opacity-pressed': opacity.pressed,
        'opacity-disabled': opacity.disabled,
        'opacity-placeholder': opacity.placeholder,
        'opacity-overlay': opacity.overlay,
        'opacity-backdrop': opacity.backdrop,
      },
    },
  },
})
```

- [ ] **Step 8: Update write-theme-init.mjs**

Add token values to `scripts/write-theme-init.mjs` for FOUC prevention:

```javascript
// Add to themeInitValues object
const themeInitValues = {
  // ... existing values
  // Motion tokens
  '--motion-duration-fast': motion.duration.fast,
  '--motion-duration-normal': motion.duration.normal,
  '--motion-duration-slow': motion.duration.slow,
  '--motion-duration-slower': motion.duration.slower,
  '--motion-easing-default': motion.easing.default,
  '--motion-easing-in': motion.easing.in,
  '--motion-easing-out': motion.easing.out,
  '--motion-easing-in-out': motion.easing.inOut,
  '--motion-easing-bounce': motion.easing.bounce,
  '--motion-easing-spring': motion.easing.spring,

  // Z-index tokens
  '--z-index-dropdown': zIndex.dropdown,
  '--z-index-sticky': zIndex.sticky,
  '--z-index-fixed': zIndex.fixed,
  '--z-index-overlay': zIndex.overlay,
  '--z-index-drawer': zIndex.drawer,
  '--z-index-modal': zIndex.modal,
  '--z-index-popover': zIndex.popover,
  '--z-index-toast': zIndex.toast,
  '--z-index-tooltip': zIndex.tooltip,

  // Opacity tokens
  '--opacity-hover': opacity.hover,
  '--opacity-pressed': opacity.pressed,
  '--opacity-disabled': opacity.disabled,
  '--opacity-placeholder': opacity.placeholder,
  '--opacity-overlay': opacity.overlay,
  '--opacity-backdrop': opacity.backdrop,

  // Transition tokens
  '--transitions-fast': transitions.fast,
  '--transitions-normal': transitions.normal,
  '--transitions-slow': transitions.slow,
  '--transitions-color': transitions.color,
  '--transitions-transform': transitions.transform,
  '--transitions-shadow': transitions.shadow,
  '--transitions-fade': transitions.fade,
  '--transitions-slide': transitions.slide,
  '--transitions-scale': transitions.scale,
}
```

- [ ] **Step 9: Run tests to verify token generation**

```bash
cd packages/design-tokens
pnpm test
```

Expected: All existing tests pass, new token modules are exported correctly.

- [ ] **Step 10: Commit changes**

```bash
git add packages/design-tokens/src/motion.ts packages/design-tokens/src/z-index.ts packages/design-tokens/src/opacity.ts packages/design-tokens/src/transitions.ts packages/design-tokens/src/index.ts packages/design-tokens/src/to-css.ts packages/design-tokens/src/theme/tailwind.ts scripts/write-theme-init.mjs
git commit -m "feat(design-tokens): add motion, zIndex, opacity, and transition token modules"
```

---

## Task 2: Color System Enhancement - Primary Scale, Secondary/Accent/Destructive Colors

**Files:**

- Modify: `packages/design-tokens/src/colors.ts`
- Modify: `packages/design-tokens/src/to-css.ts`
- Modify: `scripts/write-theme-init.mjs`

- [ ] **Step 1: Add primaryScale to colors.ts**

Add to `packages/design-tokens/src/colors.ts`:

```typescript
export const colors = {
  // ... existing colors
  primaryScale: {
    50: '#e6f4ff',
    100: '#bae0ff',
    200: '#91caff',
    300: '#69b1ff',
    400: '#4096ff',
    500: '#1677ff', // Matches colors.primary
    600: '#0958d9',
    700: '#003eb3',
    800: '#002c8c',
    900: '#001d66',
  },

  // Secondary color - slate series
  secondary: '#64748b', // slate-500
  secondaryHover: '#475569', // slate-600
  secondaryPressed: '#334155', // slate-700

  // Accent color - violet series
  accent: '#8b5cf6', // violet-500
  accentHover: '#7c3aed', // violet-600
  accentPressed: '#6d28d9', // violet-700

  // Destructive color - red series (different from error)
  destructive: '#ef4444', // red-500
  destructiveHover: '#dc2626', // red-600
  destructivePressed: '#b91c1c', // red-700
}
```

- [ ] **Step 2: Add interactive state colors to ThemeSnapshot**

Modify `packages/design-tokens/src/theme/types.ts`:

```typescript
export interface ThemeSnapshot {
  // ... existing 20 fields

  // Interactive state colors (light/dark mode dependent)
  colorBgHover: string // Hover background
  colorBgPressed: string // Pressed background
  colorBgSelected: string // Selected background
  colorBorderHover: string // Hover border
  colorBorderFocus: string // Focus ring color
  colorDestructive: string // Destructive color
  colorDestructiveHover: string // Destructive hover
  colorDestructivePressed: string // Destructive pressed
}
```

- [ ] **Step 3: Update defaultLightTheme with new fields**

Modify `packages/design-tokens/src/theme/default.ts`:

```typescript
export const defaultLightTheme: ThemeSnapshot = {
  // ... existing fields

  // New interactive state colors
  colorBgHover: 'rgba(0, 0, 0, 0.04)',
  colorBgPressed: 'rgba(0, 0, 0, 0.08)',
  colorBgSelected: 'rgba(22, 119, 255, 0.08)',
  colorBorderHover: '#bfbfbf',
  colorBorderFocus: '#1677ff',
  colorDestructive: '#ef4444',
  colorDestructiveHover: '#dc2626',
  colorDestructivePressed: '#b91c1c',
}
```

- [ ] **Step 4: Update CSS variable generation**

Modify `packages/design-tokens/src/to-css.ts` to include new color variables:

```typescript
// Add to generateCssVarsString()
const generateCssVarsString = (snapshot: ThemeSnapshot) => {
  // ... existing variable generation

  // Add new color variables
  return `
    ${existingVars}
    --color-primary-scale-50: ${colors.primaryScale[50]};
    --color-primary-scale-100: ${colors.primaryScale[100]};
    --color-primary-scale-200: ${colors.primaryScale[200]};
    --color-primary-scale-300: ${colors.primaryScale[300]};
    --color-primary-scale-400: ${colors.primaryScale[400]};
    --color-primary-scale-500: ${colors.primaryScale[500]};
    --color-primary-scale-600: ${colors.primaryScale[600]};
    --color-primary-scale-700: ${colors.primaryScale[700]};
    --color-primary-scale-800: ${colors.primaryScale[800]};
    --color-primary-scale-900: ${colors.primaryScale[900]};
    --color-secondary: ${colors.secondary};
    --color-secondary-hover: ${colors.secondaryHover};
    --color-secondary-pressed: ${colors.secondaryPressed};
    --color-accent: ${colors.accent};
    --color-accent-hover: ${colors.accentHover};
    --color-accent-pressed: ${colors.accentPressed};
    --color-destructive: ${colors.destructive};
    --color-destructive-hover: ${colors.destructiveHover};
    --color-destructive-pressed: ${colors.destructivePressed};
    --theme-color-bg-hover: ${snapshot.colorBgHover};
    --theme-color-bg-pressed: ${snapshot.colorBgPressed};
    --theme-color-bg-selected: ${snapshot.colorBgSelected};
    --theme-color-border-hover: ${snapshot.colorBorderHover};
    --theme-color-border-focus: ${snapshot.colorBorderFocus};
    --theme-color-destructive: ${snapshot.colorDestructive};
    --theme-color-destructive-hover: ${snapshot.colorDestructiveHover};
    --theme-color-destructive-pressed: ${snapshot.colorDestructivePressed};
  `
}
```

- [ ] **Step 5: Update write-theme-init.mjs with new color values**

Add to `scripts/write-theme-init.mjs`:

```javascript
const themeInitValues = {
  // ... existing values

  // Primary scale colors (static)
  '--color-primary-scale-50': colors.primaryScale[50],
  '--color-primary-scale-100': colors.primaryScale[100],
  '--color-primary-scale-200': colors.primaryScale[200],
  '--color-primary-scale-300': colors.primaryScale[300],
  '--color-primary-scale-400': colors.primaryScale[400],
  '--color-primary-scale-500': colors.primaryScale[500],
  '--color-primary-scale-600': colors.primaryScale[600],
  '--color-primary-scale-700': colors.primaryScale[700],
  '--color-primary-scale-800': colors.primaryScale[800],
  '--color-primary-scale-900': colors.primaryScale[900],

  // Secondary/Accent/Destructive colors (static)
  '--color-secondary': colors.secondary,
  '--color-secondary-hover': colors.secondaryHover,
  '--color-secondary-pressed': colors.secondaryPressed,
  '--color-accent': colors.accent,
  '--color-accent-hover': colors.accentHover,
  '--color-accent-pressed': colors.accentPressed,
  '--color-destructive': colors.destructive,
  '--color-destructive-hover': colors.destructiveHover,
  '--color-destructive-pressed': colors.destructivePressed,

  // Interactive state colors (light theme defaults)
  '--theme-color-bg-hover': 'rgba(0, 0, 0, 0.04)',
  '--theme-color-bg-pressed': 'rgba(0, 0, 0, 0.08)',
  '--theme-color-bg-selected': 'rgba(22, 119, 255, 0.08)',
  '--theme-color-border-hover': '#bfbfbf',
  '--theme-color-border-focus': '#1677ff',
  '--theme-color-destructive': '#ef4444',
  '--theme-color-destructive-hover': '#dc2626',
  '--theme-color-destructive-pressed': '#b91c1c',
}
```

- [ ] **Step 6: Run tests to verify color token generation**

```bash
cd packages/design-tokens
pnpm test
```

Expected: All tests pass, new color variables are generated correctly.

- [ ] **Step 7: Commit changes**

```bash
git add packages/design-tokens/src/colors.ts packages/design-tokens/src/theme/types.ts packages/design-tokens/src/theme/default.ts packages/design-tokens/src/to-css.ts scripts/write-theme-init.mjs
git commit -m "feat(design-tokens): enhance color system with scale, secondary/accent/destructive, and interactive states"
```

---

## Task 3: Dark Theme Derivation and Compact Theme Variant

**Files:**

- Create: `packages/design-tokens/src/theme/compact.ts`
- Modify: `packages/design-tokens/src/theme/derive-dark.ts`
- Modify: `packages/design-tokens/src/theme/registry.ts`
- Modify: `packages/shared-utils/src/ui-contract/index.ts`

- [ ] **Step 1: Update ThemeName type in ui-contract**

Modify `packages/shared-utils/src/ui-contract/index.ts`:

```typescript
export type ThemeName = 'default' | 'compact'
export const themeNameValues = ['default', 'compact'] as const satisfies readonly ThemeName[]
```

- [ ] **Step 2: Create compact theme variant**

Create `packages/design-tokens/src/theme/compact.ts`:

```typescript
import { defaultLightTheme } from './default'

export const compactLightTheme = {
  ...defaultLightTheme,
  // Compact spacing
  spacingPanelX: '16px',
  spacingPanelY: '16px',
  // Compact radii
  radiusSm: '1px',
  radiusMd: '3px',
  radiusLg: '4px',
}
```

- [ ] **Step 3: Update deriveDarkFromLight with new fields**

Modify `packages/design-tokens/src/theme/derive-dark.ts`:

```typescript
import { ThemeSnapshot } from './types'

export function deriveDarkFromLight(lightSnapshot: ThemeSnapshot): ThemeSnapshot {
  return {
    ...lightSnapshot,

    // Background colors (dark surface hierarchy)
    colorBgPage: '#141414',
    colorBgCard: '#1f1f1f',
    colorBgElevated: '#262626',

    // Text colors (inverted hierarchy)
    colorTextPrimary: '#e8e8e8',
    colorTextSecondary: '#bfbfbf',
    colorTextMuted: '#8c8c8c',

    // Border colors
    colorBorder: '#434343',
    colorBorderStrong: '#595959',

    // Brand colors (primary stays same, hover brightened)
    colorBrandPrimary: lightSnapshot.colorBrandPrimary,
    colorBrandPrimaryHover: '#69b1ff',
    colorBrandPrimaryActive: lightSnapshot.colorBrandPrimaryActive,

    // Status colors (brightened for dark background)
    colorSuccess: '#73d13d',
    colorWarning: '#ffc53d',
    colorError: '#ff7875',
    colorInfo: '#69b1ff',

    // Interactive states (direction reversed)
    colorBgHover: 'rgba(255, 255, 255, 0.08)',
    colorBgPressed: 'rgba(255, 255, 255, 0.12)',
    colorBgSelected: 'rgba(22, 119, 255, 0.16)',
    colorBorderHover: '#434343',
    colorBorderFocus: '#69b1ff',

    // Destructive colors (stay same as light)
    colorDestructive: lightSnapshot.colorDestructive,
    colorDestructiveHover: lightSnapshot.colorDestructiveHover,
    colorDestructivePressed: lightSnapshot.colorDestructivePressed,

    // Shadows (increased opacity for dark background)
    shadowPanel: '0 1px 2px 0 rgba(0,0,0,0.35), 0 1px 3px 0 rgba(0,0,0,0.25)',
    shadowRaised: '0 4px 12px 0 rgba(0,0,0,0.35), 0 2px 6px 0 rgba(0,0,0,0.25)',
  }
}
```

- [ ] **Step 4: Update theme registry**

Modify `packages/design-tokens/src/theme/registry.ts`:

```typescript
import { deriveDarkFromLight } from './derive-dark'
import { defaultLightTheme } from './default'
import { compactLightTheme } from './compact'

export const themeRegistry = {
  default: {
    light: defaultLightTheme,
    dark: deriveDarkFromLight(defaultLightTheme),
  },
  compact: {
    light: compactLightTheme,
    dark: deriveDarkFromLight(compactLightTheme),
  },
}
```

- [ ] **Step 5: Update write-theme-init.mjs for dark theme**

Add dark theme values to `scripts/write-theme-init.mjs`:

```javascript
const darkThemeValues = {
  '--theme-color-bg-page': '#141414',
  '--theme-color-bg-card': '#1f1f1f',
  '--theme-color-bg-elevated': '#262626',
  '--theme-color-text-primary': '#e8e8e8',
  '--theme-color-text-secondary': '#bfbfbf',
  '--theme-color-text-muted': '#8c8c8c',
  '--theme-color-border': '#434343',
  '--theme-color-border-strong': '#595959',
  '--theme-color-brand-primary-hover': '#69b1ff',
  '--theme-color-success': '#73d13d',
  '--theme-color-warning': '#ffc53d',
  '--theme-color-error': '#ff7875',
  '--theme-color-info': '#69b1ff',
  '--theme-color-bg-hover': 'rgba(255, 255, 255, 0.08)',
  '--theme-color-bg-pressed': 'rgba(255, 255, 255, 0.12)',
  '--theme-color-bg-selected': 'rgba(22, 119, 255, 0.16)',
  '--theme-color-border-hover': '#434343',
  '--theme-color-border-focus': '#69b1ff',
  '--shadow-panel': '0 1px 2px 0 rgba(0,0,0,0.35), 0 1px 3px 0 rgba(0,0,0,0.25)',
  '--shadow-raised': '0 4px 12px 0 rgba(0,0,0,0.35), 0 2px 6px 0 rgba(0,0,0,0.25)',
}
```

- [ ] **Step 6: Run tests to verify dark theme derivation**

```bash
cd packages/design-tokens
pnpm test
```

Expected: Derive-dark tests pass, compact theme is registered correctly.

- [ ] **Step 7: Commit changes**

```bash
git add packages/shared-utils/src/ui-contract/index.ts packages/design-tokens/src/theme/compact.ts packages/design-tokens/src/theme/derive-dark.ts packages/design-tokens/src/theme/registry.ts scripts/write-theme-init.mjs
git commit -m "feat(design-tokens): implement dark theme derivation and compact theme variant"
```

---

## Task 4: shadcn/ui CSS Variable Bridge

**Files:**

- Create: `packages/design-tokens/src/shadcn-bridge.ts`
- Modify: `packages/design-tokens/src/to-css.ts`

- [ ] **Step 1: Create shadcn-bridge.ts**

Create `packages/design-tokens/src/shadcn-bridge.ts`:

```typescript
import { ThemeSnapshot } from './theme/types'

// Bridge mapping: shadcn/ui CSS variables → runtime theme variables
export const shadcnBridgeMap = {
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
} as const

export type ShadcnBridgeKey = keyof typeof shadcnBridgeMap

// Generate CSS string for bridge variables
export function generateShadcnBridgeVars(): string {
  return Object.entries(shadcnBridgeMap)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n    ')
}
```

- [ ] **Step 2: Update to-css.ts to include bridge variables**

Modify `packages/design-tokens/src/to-css.ts`:

```typescript
import { generateShadcnBridgeVars } from './shadcn-bridge'

export function generateCssVarsString(snapshot: ThemeSnapshot): string {
  // ... existing variable generation

  const bridgeVars = generateShadcnBridgeVars()

  return `
    :root {
      ${existingVars}
      
      /* shadcn/ui bridge variables */
      ${bridgeVars}
    }
  `
}
```

- [ ] **Step 3: Run tests to verify bridge variable generation**

```bash
cd packages/design-tokens
pnpm test
```

Expected: Bridge variables are generated correctly in CSS output.

- [ ] **Step 4: Commit changes**

```bash
git add packages/design-tokens/src/shadcn-bridge.ts packages/design-tokens/src/to-css.ts
git commit -m "feat(design-tokens): add shadcn/ui CSS variable bridge mapping"
```

---

## Task 5: shadcn/ui Infrastructure Setup in shared-ui

**Files:**

- Modify: `packages/shared-ui/package.json`
- Create: `packages/shared-ui/src/lib/utils.ts`
- Create: `packages/shared-ui/components.json`
- Modify: `packages/shared-ui/tsconfig.json`
- Modify: `packages/shared-ui/vite.config.ts`

- [ ] **Step 1: Update package.json dependencies**

Modify `packages/shared-ui/package.json`:

```json
{
  "dependencies": {
    // ... existing dependencies
    "@radix-ui/react-slot": "^1.0.0",
    "@radix-ui/react-separator": "^1.0.0",
    "@radix-ui/react-dialog": "^1.0.0",
    "@radix-ui/react-alert-dialog": "^1.0.0",
    "@radix-ui/react-dropdown-menu": "^1.0.0",
    "@radix-ui/react-popover": "^1.0.0",
    "@radix-ui/react-select": "^1.0.0",
    "@radix-ui/react-tabs": "^1.0.0",
    "@radix-ui/react-tooltip": "^1.0.0",
    "@radix-ui/react-checkbox": "^1.0.0",
    "@radix-ui/react-radio-group": "^1.0.0",
    "@radix-ui/react-switch": "^1.0.0",
    "@radix-ui/react-avatar": "^1.0.0",
    "@radix-ui/react-progress": "^1.0.0",
    "@radix-ui/react-scroll-area": "^1.0.0",
    "@radix-ui/react-accordion": "^1.0.0",
    "@radix-ui/react-toast": "^1.0.0",
    "@radix-ui/react-toggle": "^1.0.0",
    "@radix-ui/react-toggle-group": "^1.0.0",
    "@radix-ui/react-collapsible": "^1.0.0",
    "@radix-ui/react-slider": "^1.0.0",
    "@radix-ui/react-aspect-ratio": "^1.0.0",
    "@radix-ui/react-label": "^1.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "lucide-react": "^0.300.0"
  },
  "peerDependencies": {
    // ... existing peer dependencies
    "cmdk": "^0.2.0",
    "vaul": "^0.9.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0"
  }
}
```

- [ ] **Step 2: Create cn() utility function**

Create `packages/shared-ui/src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 3: Create components.json configuration**

Create `packages/shared-ui/components.json`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "../../apps/react-app/src/styles/tailwind.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 4: Update tsconfig.json paths**

Modify `packages/shared-ui/tsconfig.json`:

```json
{
  "compilerOptions": {
    // ... existing options
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 5: Update vite.config.ts alias**

Modify `packages/shared-ui/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ... rest of config
})
```

- [ ] **Step 6: Install dependencies**

```bash
cd packages/shared-ui
pnpm install
```

Expected: All dependencies are installed successfully.

- [ ] **Step 7: Commit changes**

```bash
git add packages/shared-ui/package.json packages/shared-ui/src/lib/utils.ts packages/shared-ui/components.json packages/shared-ui/tsconfig.json packages/shared-ui/vite.config.ts
git commit -m "feat(shared-ui): setup shadcn/ui infrastructure with cn() utility and configuration"
```

---

## Task 6: Tier 1 Core Components Implementation

**Files:**

- Create: `packages/shared-ui/src/components/ui/button.tsx`
- Create: `packages/shared-ui/src/components/ui/input.tsx`
- Create: `packages/shared-ui/src/components/ui/label.tsx`
- Create: `packages/shared-ui/src/components/ui/card.tsx`
- Create: `packages/shared-ui/src/components/ui/badge.tsx`
- Create: `packages/shared-ui/src/components/ui/separator.tsx`
- Create: `packages/shared-ui/src/components/ui/index.ts`

- [ ] **Step 1: Create Button component**

Create `packages/shared-ui/src/components/ui/button.tsx`:

```typescript
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  ref?: React.Ref<HTMLButtonElement>
}

function Button({ ref, className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
}

export { Button, buttonVariants }
export type { ButtonProps }
```

- [ ] **Step 2: Create Input component**

Create `packages/shared-ui/src/components/ui/input.tsx`:

```typescript
import * as React from 'react'
import { cn } from '../../lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'default' | 'sm' | 'lg'
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size = 'default', error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          {
            'h-9': size === 'sm',
            'h-11': size === 'lg',
            'border-destructive focus-visible:ring-destructive': error,
          },
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input }
export type { InputProps }
```

- [ ] **Step 3: Create Label component**

Create `packages/shared-ui/src/components/ui/label.tsx`:

```typescript
import * as React from 'react'
import { cn } from '../../lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          className,
        )}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )
  },
)
Label.displayName = 'Label'

export { Label }
export type { LabelProps }
```

- [ ] **Step 4: Create Card component**

Create `packages/shared-ui/src/components/ui/card.tsx`:

```typescript
import * as React from 'react'
import { cn } from '../../lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  ),
)
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  ),
)
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

- [ ] **Step 5: Create Badge component**

Create `packages/shared-ui/src/components/ui/badge.tsx`:

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
```

- [ ] **Step 6: Create Separator component**

Create `packages/shared-ui/src/components/ui/separator.tsx`:

```typescript
import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '../../lib/utils'

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(({ className, orientation = 'horizontal', decorative = true, ...props }, ref) => (
  <SeparatorPrimitive.Root
    ref={ref}
    decorative={decorative}
    orientation={orientation}
    className={cn(
      'shrink-0 bg-border',
      orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
      className,
    )}
    {...props}
  />
))
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
```

- [ ] **Step 7: Create barrel export index.ts**

Create `packages/shared-ui/src/components/ui/index.ts`:

```typescript
export * from './button'
export * from './input'
export * from './label'
export * from './card'
export * from './badge'
export * from './separator'
```

- [ ] **Step 8: Run tests to verify component rendering**

```bash
cd packages/shared-ui
pnpm test
```

Expected: Components are exported correctly and can be imported.

- [ ] **Step 9: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/button.tsx packages/shared-ui/src/components/ui/input.tsx packages/shared-ui/src/components/ui/label.tsx packages/shared-ui/src/components/ui/card.tsx packages/shared-ui/src/components/ui/badge.tsx packages/shared-ui/src/components/ui/separator.tsx packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): implement Tier 1 core components (Button, Input, Label, Card, Badge, Separator)"
```

---

## Task 7: Tier 2 Important Components Implementation

**Files:**

- Create: `packages/shared-ui/src/components/ui/select.tsx`
- Create: `packages/shared-ui/src/components/ui/checkbox.tsx`
- Create: `packages/shared-ui/src/components/ui/radio-group.tsx`
- Create: `packages/shared-ui/src/components/ui/switch.tsx`
- Create: `packages/shared-ui/src/components/ui/textarea.tsx`
- Create: `packages/shared-ui/src/components/ui/dialog.tsx`
- Create: `packages/shared-ui/src/components/ui/alert-dialog.tsx`
- Create: `packages/shared-ui/src/components/ui/dropdown-menu.tsx`
- Create: `packages/shared-ui/src/components/ui/tooltip.tsx`
- Create: `packages/shared-ui/src/components/ui/popover.tsx`
- Create: `packages/shared-ui/src/components/ui/table.tsx`
- Create: `packages/shared-ui/src/components/ui/tabs.tsx`

- [ ] **Step 1: Create Select component**

Create `packages/shared-ui/src/components/ui/select.tsx`:

```typescript
import * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'

const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      className,
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        'relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
}
```

- [ ] **Step 2: Create Checkbox component**

Create `packages/shared-ui/src/components/ui/checkbox.tsx`:

```typescript
import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
```

- [ ] **Step 3: Create RadioGroup component**

Create `packages/shared-ui/src/components/ui/radio-group.tsx`:

```typescript
import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        'aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }
```

- [ ] **Step 4: Create Switch component**

Create `packages/shared-ui/src/components/ui/switch.tsx`:

```typescript
import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '../../lib/utils'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
```

- [ ] **Step 5: Create Textarea component**

Create `packages/shared-ui/src/components/ui/textarea.tsx`:

```typescript
import * as React from 'react'
import { cn } from '../../lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive focus-visible:ring-destructive',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Textarea.displayName = 'Textarea'

export { Textarea }
```

- [ ] **Step 6: Create Dialog component**

Create `packages/shared-ui/src/components/ui/dialog.tsx`:

```typescript
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
)
DialogHeader.displayName = 'DialogHeader'

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
DialogFooter.displayName = 'DialogFooter'

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

- [ ] **Step 7: Create AlertDialog component**

Create `packages/shared-ui/src/components/ui/alert-dialog.tsx`:

```typescript
import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '../../lib/utils'
import { buttonVariants } from './button'

const AlertDialog = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const AlertDialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left', className)}
    {...props}
  />
)
AlertDialogHeader.displayName = 'AlertDialogHeader'

const AlertDialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
)
AlertDialogFooter.displayName = 'AlertDialogFooter'

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold', className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(buttonVariants({ variant: 'outline' }), 'mt-2 sm:mt-0', className)}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
```

- [ ] **Step 8: Create DropdownMenu component**

Create `packages/shared-ui/src/components/ui/dropdown-menu.tsx`:

```typescript
import * as React from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { cn } from '../../lib/utils'

const DropdownMenu = DropdownMenuPrimitive.Root
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
const DropdownMenuGroup = DropdownMenuPrimitive.Group
const DropdownMenuPortal = DropdownMenuPrimitive.Portal
const DropdownMenuSub = DropdownMenuPrimitive.Sub
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent',
      inset && 'pl-8',
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-auto h-4 w-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      inset && 'pl-8',
      className,
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    checked={checked}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn('px-2 py-1.5 text-sm font-semibold', inset && 'pl-8', className)}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('ml-auto text-xs tracking-widest opacity-60', className)} {...props} />
  )
}
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut'

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
```

- [ ] **Step 9: Create Tooltip component**

Create `packages/shared-ui/src/components/ui/tooltip.tsx`:

```typescript
import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '../../lib/utils'

const TooltipProvider = TooltipPrimitive.Provider
const Tooltip = TooltipPrimitive.Root
const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

- [ ] **Step 10: Create Popover component**

Create `packages/shared-ui/src/components/ui/popover.tsx`:

```typescript
import * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { cn } from '../../lib/utils'

const Popover = PopoverPrimitive.Root
const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent }
```

- [ ] **Step 11: Create Table component**

Create `packages/shared-ui/src/components/ui/table.tsx`:

```typescript
import * as React from 'react'
import { cn } from '../../lib/utils'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table
        ref={ref}
        className={cn('w-full caption-bottom text-sm', className)}
        {...props}
      />
    </div>
  ),
)
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  ),
)
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
```

- [ ] **Step 12: Create Tabs component**

Create `packages/shared-ui/src/components/ui/tabs.tsx`:

```typescript
import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '../../lib/utils'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
```

- [ ] **Step 13: Update barrel export index.ts**

Update `packages/shared-ui/src/components/ui/index.ts`:

```typescript
export * from './button'
export * from './input'
export * from './label'
export * from './card'
export * from './badge'
export * from './separator'
export * from './select'
export * from './checkbox'
export * from './radio-group'
export * from './switch'
export * from './textarea'
export * from './dialog'
export * from './alert-dialog'
export * from './dropdown-menu'
export * from './tooltip'
export * from './popover'
export * from './table'
export * from './tabs'
```

- [ ] **Step 14: Run tests to verify component rendering**

```bash
cd packages/shared-ui
pnpm test
```

Expected: All Tier 2 components are exported correctly and can be imported.

- [ ] **Step 15: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/select.tsx packages/shared-ui/src/components/ui/checkbox.tsx packages/shared-ui/src/components/ui/radio-group.tsx packages/shared-ui/src/components/ui/switch.tsx packages/shared-ui/src/components/ui/textarea.tsx packages/shared-ui/src/components/ui/dialog.tsx packages/shared-ui/src/components/ui/alert-dialog.tsx packages/shared-ui/src/components/ui/dropdown-menu.tsx packages/shared-ui/src/components/ui/tooltip.tsx packages/shared-ui/src/components/ui/popover.tsx packages/shared-ui/src/components/ui/table.tsx packages/shared-ui/src/components/ui/tabs.tsx packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): implement Tier 2 important components (Select, Checkbox, RadioGroup, Switch, Textarea, Dialog, AlertDialog, DropdownMenu, Tooltip, Popover, Table, Tabs)"
```

---

## Task 8: Tier 3 Advanced Components Implementation

**Files:**

- Create: `packages/shared-ui/src/components/ui/avatar.tsx`
- Create: `packages/shared-ui/src/components/ui/progress.tsx`
- Create: `packages/shared-ui/src/components/ui/scroll-area.tsx`
- Create: `packages/shared-ui/src/components/ui/accordion.tsx`
- Create: `packages/shared-ui/src/components/ui/toast.tsx`
- Create: `packages/shared-ui/src/components/ui/toaster.tsx`
- Create: `packages/shared-ui/src/components/ui/toggle.tsx`
- Create: `packages/shared-ui/src/components/ui/toggle-group.tsx`
- Create: `packages/shared-ui/src/components/ui/collapsible.tsx`
- Create: `packages/shared-ui/src/components/ui/slider.tsx`
- Create: `packages/shared-ui/src/components/ui/pagination.tsx`
- Create: `packages/shared-ui/src/components/ui/skeleton.tsx`
- Create: `packages/shared-ui/src/components/ui/aspect-ratio.tsx`

- [ ] **Step 1: Create Avatar component**

Create `packages/shared-ui/src/components/ui/avatar.tsx`:

```typescript
import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '../../lib/utils'

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn('relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full', className)}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
```

- [ ] **Step 2: Create Progress component**

Create `packages/shared-ui/src/components/ui/progress.tsx`:

```typescript
import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '../../lib/utils'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
```

- [ ] **Step 3: Create ScrollArea component**

Create `packages/shared-ui/src/components/ui/scroll-area.tsx`:

```typescript
import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '../../lib/utils'

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors',
      orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
```

- [ ] **Step 4: Create Accordion component**

Create `packages/shared-ui/src/components/ui/accordion.tsx`:

```typescript
import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
))
AccordionItem.displayName = 'AccordionItem'

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
```

- [ ] **Step 5: Create Toast component**

Create `packages/shared-ui/src/components/ui/toast.tsx`:

```typescript
import * as React from 'react'
import * as ToastPrimitives from '@radix-ui/react-toast'
import { cva, type VariantProps } from 'class-variance-authority'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className,
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
  {
    variants: {
      variant: {
        default: 'border bg-background text-foreground',
        destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className,
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
```

- [ ] **Step 6: Create Toaster component**

Create `packages/shared-ui/src/components/ui/toaster.tsx`:

```typescript
import { useToast } from '../../hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
```

- [ ] **Step 7: Create useToast hook**

Create `packages/shared-ui/src/hooks/use-toast.ts`:

```typescript
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '../components/ui/toast'

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType['ADD_TOAST']
      toast: ToasterToast
    }
  | {
      type: ActionType['UPDATE_TOAST']
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType['DISMISS_TOAST']
      toastId?: ToasterToast['id']
    }
  | {
      type: ActionType['REMOVE_TOAST']
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, 'id'>

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: 'UPDATE_TOAST',
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
```

- [ ] **Step 8: Create Toggle component**

Create `packages/shared-ui/src/components/ui/toggle.tsx`:

```typescript
import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const toggleVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }
```

- [ ] **Step 9: Create ToggleGroup component**

Create `packages/shared-ui/src/components/ui/toggle-group.tsx`:

```typescript
import * as React from 'react'
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-3',
        sm: 'h-9 px-2.5',
        lg: 'h-11 px-5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleGroupItemVariants>>({
  size: 'default',
  variant: 'default',
})

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleGroupItemVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cn('flex items-center justify-center gap-1', className)}
    {...props}
  >
    <ToggleGroupContext.Provider value={{ variant, size }}>{children}</ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleGroupItemVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  const context = React.useContext(ToggleGroupContext)
  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        toggleGroupItemVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

export { ToggleGroup, ToggleGroupItem }
```

- [ ] **Step 10: Create Collapsible component**

Create `packages/shared-ui/src/components/ui/collapsible.tsx`:

```typescript
import * as CollapsiblePrimitive from '@radix-ui/react-collapsible'

const Collapsible = CollapsiblePrimitive.Root

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
```

- [ ] **Step 11: Create Slider component**

Create `packages/shared-ui/src/components/ui/slider.tsx`:

```typescript
import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../lib/utils'

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn('relative flex w-full touch-none select-none items-center', className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
```

- [ ] **Step 12: Create Pagination component**

Create `packages/shared-ui/src/components/ui/pagination.tsx`:

```typescript
import * as React from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../../lib/utils'
import { type ButtonProps, buttonVariants } from './button'

const Pagination = ({ className, ...props }: React.ComponentProps<'nav'>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn('mx-auto flex w-full justify-center', className)}
    {...props}
  />
)
Pagination.displayName = 'Pagination'

const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<'ul'>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex flex-row items-center gap-1', className)} {...props} />
  ),
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<'li'>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('', className)} {...props} />
  ),
)
PaginationItem.displayName = 'PaginationItem'

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<ButtonProps, 'size'> &
  React.ComponentProps<'a'>

const PaginationLink = ({ className, isActive, size = 'icon', ...props }: PaginationLinkProps) => (
  <a
    aria-current={isActive ? 'page' : undefined}
    className={cn(
      buttonVariants({
        variant: isActive ? 'outline' : 'ghost',
        size,
      }),
      className,
    )}
    {...props}
  />
)
PaginationLink.displayName = 'PaginationLink'

const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn('gap-1 pl-2.5', className)}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = 'PaginationPrevious'

const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn('gap-1 pr-2.5', className)}
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
)
PaginationNext.displayName = 'PaginationNext'

const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<'span'>) => (
  <span
    aria-hidden
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}
```

- [ ] **Step 13: Create Skeleton component**

Create `packages/shared-ui/src/components/ui/skeleton.tsx`:

```typescript
import { cn } from '../../lib/utils'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
```

- [ ] **Step 14: Create AspectRatio component**

Create `packages/shared-ui/src/components/ui/aspect-ratio.tsx`:

```typescript
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio'

const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }
```

- [ ] **Step 15: Update barrel export index.ts**

Update `packages/shared-ui/src/components/ui/index.ts`:

```typescript
export * from './button'
export * from './input'
export * from './label'
export * from './card'
export * from './badge'
export * from './separator'
export * from './select'
export * from './checkbox'
export * from './radio-group'
export * from './switch'
export * from './textarea'
export * from './dialog'
export * from './alert-dialog'
export * from './dropdown-menu'
export * from './tooltip'
export * from './popover'
export * from './table'
export * from './tabs'
export * from './avatar'
export * from './progress'
export * from './scroll-area'
export * from './accordion'
export * from './toast'
export * from './toaster'
export * from './toggle'
export * from './toggle-group'
export * from './collapsible'
export * from './slider'
export * from './pagination'
export * from './skeleton'
export * from './aspect-ratio'
```

- [ ] **Step 16: Run tests to verify component rendering**

```bash
cd packages/shared-ui
pnpm test
```

Expected: All Tier 3 components are exported correctly and can be imported.

- [ ] **Step 17: Commit changes**

```bash
git add packages/shared-ui/src/components/ui/avatar.tsx packages/shared-ui/src/components/ui/progress.tsx packages/shared-ui/src/components/ui/scroll-area.tsx packages/shared-ui/src/components/ui/accordion.tsx packages/shared-ui/src/components/ui/toast.tsx packages/shared-ui/src/components/ui/toaster.tsx packages/shared-ui/src/components/ui/toggle.tsx packages/shared-ui/src/components/ui/toggle-group.tsx packages/shared-ui/src/components/ui/collapsible.tsx packages/shared-ui/src/components/ui/slider.tsx packages/shared-ui/src/components/ui/pagination.tsx packages/shared-ui/src/components/ui/skeleton.tsx packages/shared-ui/src/components/ui/aspect-ratio.tsx packages/shared-ui/src/hooks/use-toast.ts packages/shared-ui/src/components/ui/index.ts
git commit -m "feat(shared-ui): implement Tier 3 advanced components (Avatar, Progress, ScrollArea, Accordion, Toast, Toggle, ToggleGroup, Collapsible, Slider, Pagination, Skeleton, AspectRatio)"
```

---

## Task 9: Component Showcase Page Implementation

**Files:**

- Create: `apps/react-app/src/views/showcase/ComponentShowcaseView.tsx`
- Modify: `apps/react-app/src/router/index.tsx`

- [ ] **Step 1: Create ComponentShowcaseView**

Create `apps/react-app/src/views/showcase/ComponentShowcaseView.tsx`:

```typescript
import * as React from 'react'
import { cn } from '@repo/shared-ui/lib/utils'
import {
  Button,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Textarea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  ScrollArea,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Slider,
  Skeleton,
} from '@repo/shared-ui'
import { ThemeModeSwitch } from '@repo/shared-ui'
import { useThemeStore } from '../../stores/theme'

interface ShowcaseSectionProps {
  title: string
  description?: string
  children: React.ReactNode
}

function ShowcaseSection({ title, description, children }: ShowcaseSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  )
}

export function ComponentShowcaseView() {
  const { themeName, setThemeName, preference, setPreference } = useThemeStore()

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Component Showcase</h1>
          <p className="text-muted-foreground">Explore all available UI components</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeModeSwitch />
          <Select value={themeName} onValueChange={setThemeName}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="compact">Compact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Theme Showcase */}
      <ShowcaseSection title="Theme" description="Current theme configuration">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Theme Name</Label>
                <p className="text-sm text-muted-foreground">{themeName}</p>
              </div>
              <div>
                <Label>Preference</Label>
                <p className="text-sm text-muted-foreground">{preference}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </ShowcaseSection>

      <Separator />

      {/* Button Showcase */}
      <ShowcaseSection title="Buttons" description="Button variants and sizes">
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">🔍</Button>
        </div>
        <Button disabled>Disabled</Button>
      </ShowcaseSection>

      <Separator />

      {/* Input Showcase */}
      <ShowcaseSection title="Inputs" description="Input, Textarea, and Label">
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter your email" />
        </div>
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Enter your password" />
        </div>
        <div className="w-full max-w-sm space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" placeholder="Tell us about yourself" />
        </div>
      </ShowcaseSection>

      <Separator />

      {/* Card Showcase */}
      <ShowcaseSection title="Cards" description="Card component with header, content, and footer">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is the card content. You can put any content here.</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button>Save</Button>
          </CardFooter>
        </Card>
      </ShowcaseSection>

      <Separator />

      {/* Badge Showcase */}
      <ShowcaseSection title="Badges" description="Badge variants">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </ShowcaseSection>

      <Separator />

      {/* Select Showcase */}
      <ShowcaseSection title="Select" description="Select dropdown">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectContent>
        </Select>
      </ShowcaseSection>

      <Separator />

      {/* Checkbox, Radio, Switch Showcase */}
      <ShowcaseSection title="Checkbox, Radio, Switch" description="Toggle controls">
        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms">Accept terms and conditions</Label>
        </div>
        <RadioGroup defaultValue="comfortable">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="default" id="r1" />
            <Label htmlFor="r1">Default</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="comfortable" id="r2" />
            <Label htmlFor="r2">Comfortable</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="compact" id="r3" />
            <Label htmlFor="r3">Compact</Label>
          </div>
        </RadioGroup>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Airplane Mode</Label>
        </div>
      </ShowcaseSection>

      <Separator />

      {/* Dialog Showcase */}
      <ShowcaseSection title="Dialog" description="Modal dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" value="Pedro Duarte" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input id="username" value="@peduarte" className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ShowcaseSection>

      <Separator />

      {/* AlertDialog Showcase */}
      <ShowcaseSection title="AlertDialog" description="Confirmation dialog">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Show Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account and remove
                your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ShowcaseSection>

      <Separator />

      {/* Table Showcase */}
      <ShowcaseSection title="Table" description="Data table">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell className="text-right">$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>PayPal</TableCell>
              <TableCell className="text-right">$150.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV003</TableCell>
              <TableCell>Unpaid</TableCell>
              <TableCell>Bank Transfer</TableCell>
              <TableCell className="text-right">$350.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </ShowcaseSection>

      <Separator />

      {/* Tabs Showcase */}
      <ShowcaseSection title="Tabs" description="Tabbed interface">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Make changes to your account here. Click save when you're done.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="Pedro Duarte" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="@peduarte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="password" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password here. After saving, you'll be logged out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="current">Current password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="new">New password</Label>
                  <Input id="new" type="password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </ShowcaseSection>

      <Separator />

      {/* Advanced Components Showcase */}
      <ShowcaseSection title="Advanced Components" description="Avatar, Progress, ScrollArea, Accordion, Toggle, Collapsible, Slider, Skeleton">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="w-[300px]">
          <Progress value={66} />
        </div>

        <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
          <div className="space-y-4">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="text-sm">
                Item {i + 1}
              </div>
            ))}
          </div>
        </ScrollArea>

        <Accordion type="single" collapsible className="w-[350px]">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It comes with default styles that matches the other components' aesthetic.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Is it animated?</AccordionTrigger>
            <AccordionContent>
              Yes. It's animated by default, but you can disable it if you prefer.
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Toggle>Toggle</Toggle>
        <ToggleGroup type="multiple">
          <ToggleGroupItem value="bold">B</ToggleGroupItem>
          <ToggleGroupItem value="italic">I</ToggleGroupItem>
          <ToggleGroupItem value="underline">U</ToggleGroupItem>
        </ToggleGroup>

        <Collapsible className="w-[350px] space-y-2">
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold"> starred</h4>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                Toggle
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
              @radix-ui/primitives
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
              @radix-ui/react-dialog
            </div>
            <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
              @radix-ui/react-dropdown-menu
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="w-[300px]">
          <Slider defaultValue={[33]} max={100} step={1} />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </ShowcaseSection>

      <Separator />

      {/* Tooltip Showcase */}
      <ShowcaseSection title="Tooltip" description="Hover tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline">Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ShowcaseSection>

      <Separator />

      {/* DropdownMenu Showcase */}
      <ShowcaseSection title="Dropdown Menu" description="Context menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Keyboard shortcuts</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ShowcaseSection>
    </div>
  )
}
```

- [ ] **Step 2: Update router to include showcase route**

Modify `apps/react-app/src/router/index.tsx`:

```typescript
import { createBrowserRouter } from 'react-router-dom'
import { lazy } from 'react'

const ComponentShowcaseView = lazy(() => import('../views/showcase/ComponentShowcaseView'))

export const router = createBrowserRouter([
  // ... existing routes
  {
    path: '/components',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ComponentShowcaseView />
      </Suspense>
    ),
  },
])
```

- [ ] **Step 3: Run build to verify compilation**

```bash
cd apps/react-app
pnpm build
```

Expected: Build succeeds without errors.

- [ ] **Step 4: Commit changes**

```bash
git add apps/react-app/src/views/showcase/ComponentShowcaseView.tsx apps/react-app/src/router/index.tsx
git commit -m "feat(react-app): add component showcase page with all UI components"
```

---

## Task 10: Final Integration and Testing

**Files:**

- Modify: `packages/shared-ui/src/index.ts` (ensure proper exports)
- Modify: `apps/react-app/src/bootstrap.tsx` (ensure theme provider is properly configured)

- [ ] **Step 1: Verify shared-ui exports**

Check `packages/shared-ui/src/index.ts` to ensure all components are exported:

```typescript
// Ensure these exports exist
export * from './components/ui'
export * from './components'
export * from './provider/ThemeProvider'
export * from './hooks/useThemeSnapshot'
export * from './hooks/useThemeMode'
```

- [ ] **Step 2: Verify theme provider integration**

Check `apps/react-app/src/bootstrap.tsx` to ensure ThemeProvider is properly wrapping the app:

```typescript
import { ThemeProvider } from '@repo/shared-ui'
import { Toaster } from '@repo/shared-ui'

function App() {
  return (
    <ThemeProvider>
      {/* ... app content */}
      <Toaster />
    </ThemeProvider>
  )
}
```

- [ ] **Step 3: Run full build and test suite**

```bash
# Run all builds
pnpm build:shared
pnpm build:react

# Run type checking
pnpm typecheck

# Run all tests
pnpm test

# Run linting
pnpm lint
```

Expected: All builds pass, no type errors, all tests pass, no lint errors.

- [ ] **Step 4: Manual verification**

Start the development server and verify:

```bash
pnpm dev
```

Then:

1. Navigate to `/components` to see the showcase page
2. Test theme switching (light/dark/system)
3. Test theme name switching (default/compact)
4. Verify all components render correctly
5. Test keyboard navigation for interactive components
6. Verify dark mode text contrast meets WCAG AA

- [ ] **Step 5: Final commit**

```bash
git add .
git commit -m "feat: complete UI theme enhancement and component library implementation"
```

---

## Self-Review Checklist

- [ ] **Spec coverage:** All requirements from the design document are implemented
- [ ] **No placeholders:** All steps contain complete code and exact commands
- [ ] **Type consistency:** All types, method signatures, and property names are consistent
- [ ] **Testing:** All components have basic tests and can be imported
- [ ] **Documentation:** README files updated if necessary
- [ ] **Commit messages:** All commits follow conventional commit format

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-08-ui-theme-enhancement.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
