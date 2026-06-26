# UI 主题增强与组件库设计

> 制定日期：2026-06-26
> 最近修订：2026-06-26
> 适用范围：`packages/design-tokens`、`packages/shared-ui`、`apps/react-app`
> 文档性质：专题详细设计
> 上游设计：`docs/总体设计/React 中后台前端平台 Monorepo 架构设计方案.md`（ADR-003、ADR-007）、`docs/总体设计/详细设计/Phase0-基础能力详细设计.md`（§4 主题与共享 UI）

---

## 1. 文档定位

本文档是 UI 主题增强与组件库封装的正式详细设计，覆盖三个核心领域：

1. **设计令牌增强** — 扩展 token 类别、完善颜色体系、实现暗色派生、新增主题变体
2. **shadcn/ui 基础设施与组件封装** — 搭建 shadcn/ui 运行环境、封装常用组件
3. **组件展示** — 在 react-app 中建设组件展示页面

本文档只维护设计目标、正式契约与实现规范，不承接任务拆解或完成态记录。

---

## 2. 现状分析

### 2.1 设计令牌现状

| 维度   | 现状                                                                                               | 缺口                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 颜色   | 主色 `#1677ff` + hover/pressed；语义色 success/warning/error/info；中性灰 50-900；文本/背景/边框色 | 缺少主色色阶 50-900；缺少 secondary/accent/destructive 语义色；缺少交互态（hover/pressed/selected）背景与边框 |
| 间距   | 4px 体系，0-24                                                                                     | 完备                                                                                                          |
| 排版   | 系统字体栈 + 等宽；字号 xs-4xl；行高/字重                                                          | 完备                                                                                                          |
| 圆角   | none-full，7 级                                                                                    | 完备                                                                                                          |
| 阴影   | none-xl，6 级                                                                                      | 完备                                                                                                          |
| 断点   | sm-2xl，5 级                                                                                       | 完备                                                                                                          |
| 动效   | **缺失**                                                                                           | 无时长、缓动、过渡 token                                                                                      |
| 层级   | **缺失**                                                                                           | 无 z-index token                                                                                              |
| 透明度 | **缺失**                                                                                           | 无 opacity token                                                                                              |

### 2.2 主题系统现状

| 维度          | 现状                      | 缺口                                                         |
| ------------- | ------------------------- | ------------------------------------------------------------ |
| 主题名        | 仅 `default`              | 无备选主题（compact 等）                                     |
| 暗色主题      | 硬编码 `defaultDarkTheme` | 非派生，新增主题时需手动维护暗色值                           |
| ThemeSnapshot | 20 个字段                 | 缺少交互态颜色（hover/pressed/selected）、destructive 语义色 |

### 2.3 组件库现状

| 维度     | 现状                         | 缺口                                                                                                      |
| -------- | ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| 组件数量 | 16 个手写 `.repo-*` BEM 组件 | 无基础表单组件（Button/Input/Select 等）、无反馈组件（Dialog/Toast 等）、无数据展示组件（Table/Badge 等） |
| 技术栈   | 纯 HTML + CSS 变量           | 未使用 ADR-003 确定的 shadcn/ui + Radix UI + CVA 方案                                                     |
| 样式方案 | 单一 `style.css` 文件        | 未使用 Tailwind 工具类                                                                                    |
| 变体管理 | 无                           | 无 CVA，变体通过 `data-*` 属性 + CSS 选择器实现                                                           |

### 2.4 展示现状

- 无组件展示页面
- 无 Storybook

---

## 3. 设计目标

### 3.1 本设计要交付

- 完整的 token 类别覆盖（动效、层级、透明度、过渡）
- 增强的颜色体系（色阶、secondary/accent/destructive、交互态）
- 暗色主题自动派生机制
- compact 主题变体
- shadcn/ui 运行基础设施（cn()、CVA、components.json、CSS 变量桥接）
- 基于 shadcn/ui 的完整常用组件封装（三个 Tier 共约 30 个组件）
- react-app 内的组件展示页面

### 3.2 本设计不交付

- 现有 `.repo-*` 组件的迁移重构（保持共存，后续迭代渐进替换）
- Storybook 集成
- 图表组件封装
- 独立的示例应用

---

## 4. 设计令牌增强

### 4.1 新增 Token 模块

#### 4.1.1 motion.ts — 动效 token

```ts
export const motion = {
  duration: {
    fast: '150ms', // 微交互：按钮按下、开关切换
    normal: '200ms', // 标准过渡：颜色变化、展开收起
    slow: '300ms', // 复杂动画：弹窗打开、页面切换
    slower: '500ms', // 大幅动画：全屏展开、拖拽释放
  },
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)', // 标准缓动
    in: 'cubic-bezier(0.4, 0, 1, 1)', // 元素离开
    out: 'cubic-bezier(0, 0, 0.2, 1)', // 元素进入
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)', // 进出对称
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // 弹跳
    spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // 弹簧
  },
} as const
```

CSS 变量产出：`--motion-duration-fast`、`--motion-easing-default` 等。

#### 4.1.2 zIndex.ts — 层级 token

```ts
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

CSS 变量产出：`--z-index-dropdown`、`--z-index-modal` 等。

#### 4.1.3 opacity.ts — 透明度 token

```ts
export const opacity = {
  hover: 0.08, // 悬停覆盖层
  pressed: 0.12, // 按下覆盖层
  disabled: 0.4, // 禁用态
  placeholder: 0.45, // 占位符
  overlay: 0.5, // 遮罩层
  backdrop: 0.8, // 深色遮罩
} as const
```

CSS 变量产出：`--opacity-hover`、`--opacity-disabled` 等。

#### 4.1.4 transitions.ts — 过渡预设 token（从 motion 派生）

> **设计决策**：`transitions` 不是独立的 token 定义，而是从 `motion` token 派生生成。这保证单一数据源：修改 `motion.duration.normal` 会自动反映到 `transitions.normal`。

```ts
import { motion } from './motion'

// 从 motion token 派生，而非独立定义
// 如需新增预设，只需在 motion 中定义 duration 和 easing，此处组合引用
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

CSS 变量产出：`--transitions-normal`、`--transitions-color` 等。

#### 4.1.5 集成规范

每个新 token 模块须同步更新以下文件：

| 文件                                                  | 变更                                                                                 |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `packages/design-tokens/src/<name>.ts`                | 新建 token 定义文件                                                                  |
| `packages/design-tokens/src/index.ts`                 | 新增 `export * from './<name>'`                                                      |
| `packages/design-tokens/src/to-css.ts`                | 在 `allTokens` 中添加新模块                                                          |
| `packages/design-tokens/src/theme/tailwind.ts`        | 在 `createTailwindPreset()` 中添加 Tailwind 映射                                     |
| `packages/design-tokens/src/__tests__/tokens.test.ts` | 新增 token 生成测试                                                                  |
| `scripts/write-theme-init.mjs`                        | 同步新增 token 值（此脚本为 FOUC 防闪烁预注入，硬编码了 token 值副本，必须同步更新） |

### 4.2 颜色系统增强

修改 `packages/design-tokens/src/colors.ts`，扩展以下内容：

#### 4.2.1 主色色阶

```ts
primaryScale: {
  50:  '#e6f4ff',
  100: '#bae0ff',
  200: '#91caff',
  300: '#69b1ff',
  400: '#4096ff',
  500: '#1677ff',   // 与 colors.primary 一致
  600: '#0958d9',
  700: '#003eb3',
  800: '#002c8c',
  900: '#001d66',
},
```

shadcn/ui 组件需要完整色阶支持 `bg-primary-50`、`text-primary-700` 等用法。

#### 4.2.2 新增语义色

```ts
// 次要色 — slate 系，用于次要操作、二级按钮
secondary:       '#64748b',       // slate-500
secondaryHover:  '#475569',       // slate-600
secondaryPressed:'#334155',       // slate-700

// 强调色 — violet 系，用于高亮、CTA
accent:       '#8b5cf6',         // violet-500
accentHover:  '#7c3aed',         // violet-600
accentPressed:'#6d28d9',         // violet-700

// 危险色 — red 系，用于删除、危险操作
// 与现有 error (#ff4d4f) 统一色系，destructive 取 red-500 作为组件级危险操作色
// error 用于状态标签（StatusTag），destructive 用于操作按钮（Button variant="destructive"）
destructive:       '#ef4444',    // red-500
destructiveHover:  '#dc2626',    // red-600
destructivePressed:'#b91c1c',    // red-700
```

> **error 与 destructive 的区分约定**：`error` 用于**状态展示**（StatusTag、表单校验提示），`destructive` 用于**危险操作**（删除按钮、AlertDialog 确认）。两者语义不同但同属红色系，色值接近是合理的。

#### 4.2.3 交互态扩展

> **注意**：交互态颜色在 light/dark 模式下值不同（亮色用 `rgba(0,0,0,*)` 叠加，暗色用 `rgba(255,255,255,*)` 叠加），因此这些颜色**必须**纳入 ThemeSnapshot 作为运行时可切换字段，不能作为静态 token。

```ts
bg: {
  ...existing,
  // 亮色模式值 — 暗色模式由 deriveDarkFromLight() 自动生成 rgba(255,255,255,*) 对应值
  hover:    'rgba(0, 0, 0, 0.04)',       // 悬停背景
  pressed:  'rgba(0, 0, 0, 0.08)',       // 按下背景
  selected: 'rgba(22, 119, 255, 0.08)',  // 选中背景
},

border: {
  ...existing,
  // hover 和 focus 边框在 light/dark 模式下值不同，同样需纳入 ThemeSnapshot
  hover: '#bfbfbf',   // 悬停边框（neutral-400）
  focus: '#1677ff',   // 聚焦环色（主色）
},
```

#### 4.2.4 CSS 变量命名

新增颜色变量遵循现有 `toKebabCase` + `flattenTokens` 规则：

- `--color-primary-scale-50` 至 `--color-primary-scale-900`
- `--color-secondary`、`--color-secondary-hover`、`--color-secondary-pressed`
- `--color-accent`、`--color-accent-hover`、`--color-accent-pressed`
- `--color-destructive`、`--color-destructive-hover`、`--color-destructive-pressed`
- `--color-bg-hover`、`--color-bg-pressed`、`--color-bg-selected`
- `--color-border-hover`、`--color-border-focus`

### 4.3 暗色主题自动派生

#### 4.3.1 设计原则

- 暗色主题由亮色主题**算法派生**，而非硬编码
- 新增主题变体时只需定义亮色快照，暗色自动生成
- 派生函数为纯函数，输入 `ThemeSnapshot`，输出 `ThemeSnapshot`

#### 4.3.2 新增文件

`packages/design-tokens/src/theme/derive-dark.ts`

#### 4.3.3 派生规则

| 字段                                | 派生规则                                     |
| ----------------------------------- | -------------------------------------------- |
| `colorBgPage`                       | 使用 `neutral[900]` 等价色 (`#141414`)       |
| `colorBgCard`                       | 使用 `neutral[800]` 等价色                   |
| `colorBgElevated`                   | 使用 `neutral[700]` 等价色                   |
| `colorTextPrimary`                  | 使用亮色 `textTertiary` 反转策略 (`#e8e8e8`) |
| `colorTextSecondary`                | 比主文本降低对比度                           |
| `colorTextMuted`                    | 进一步降低对比度                             |
| `colorBorder`                       | neutral 中段偏暗                             |
| `colorBorderStrong`                 | 比 border 略亮                               |
| `colorBrandPrimary`                 | 保持主色不变（或微调提亮）                   |
| `colorBrandPrimaryHover`            | 提亮 15-20%                                  |
| `colorBrandPrimaryActive`           | 保持不变或微暗                               |
| 语义色 (success/warning/error/info) | 提亮 15-20% 以保证暗背景对比度               |
| `shadowPanel/shadowRaised`          | 增加阴影透明度 (0.1 → 0.35)                  |

#### 4.3.4 注册表更新

```ts
// registry.ts
import { deriveDarkFromLight } from './derive-dark'

export const themeRegistry: ThemeRegistry = {
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

### 4.4 compact 主题变体

#### 4.4.1 契约扩展

`packages/shared-types/src/ui-contract/index.ts`：

```ts
export type ThemeName = 'default' | 'compact'
export const themeNameValues = ['default', 'compact'] as const satisfies readonly ThemeName[]
```

#### 4.4.2 compact 主题定义

新增 `packages/design-tokens/src/theme/compact.ts`，与 default 主题同色系但更紧凑：

| 字段            | default | compact | 说明         |
| --------------- | ------- | ------- | ------------ |
| `spacingPanelX` | `24px`  | `16px`  | 面板水平间距 |
| `spacingPanelY` | `24px`  | `16px`  | 面板垂直间距 |
| `radiusSm`      | `2px`   | `1px`   | 小圆角       |
| `radiusMd`      | `6px`   | `3px`   | 中圆角       |
| `radiusLg`      | `8px`   | `4px`   | 大圆角       |

其余颜色值与 default 一致。

> **compact 主题的组件级差异**：compact 主题的间距和圆角变化通过 ThemeSnapshot 的 `spacingPanelX/Y` 和 `radiusSm/Md/Lg` 字段在运行时生效，影响使用这些变量的面板级组件（DataPanel、PageContainer 等）。组件内部尺寸（Button 高度、Input 高度等）由 Tailwind 工具类硬编码（如 `h-10`），不受 ThemeSnapshot 控制。如需组件级紧凑化，需在组件 cva 变体中增加 `compact` size 变体，或通过 CSS 变量覆盖组件内间距。这属于后续迭代范畴。

### 4.5 ThemeSnapshot 扩展

在 `packages/design-tokens/src/theme/types.ts` 新增运行时可切换字段：

```ts
export interface ThemeSnapshot {
  // ...现有 20 个字段...

  // 新增交互态颜色
  colorBgHover: string // 悬停背景
  colorBgPressed: string // 按下背景
  colorBgSelected: string // 选中背景
  colorBorderHover: string // 悬停边框
  colorBorderFocus: string // 聚焦环色
  colorDestructive: string // 危险色
  colorDestructiveHover: string // 危险色悬停
  colorDestructivePressed: string // 危险色按下
}
```

新增字段须同步更新：

- `defaultLightTheme` / `defaultDarkTheme`（或由 `deriveDarkFromLight` 生成）
- `compactLightTheme`
- `themeSnapshotToCssVars()` 输出 `--theme-*` 变量
- `applyThemeToDocument()` DOM 注入
- ThemeProvider context value
- `write-theme-init.mjs` 预注入脚本（FOUC 防闪烁，硬编码 token 值副本）
- `packages/shared-types/src/ui-contract/index.ts` 类型契约（如需新增类型）

### 4.6 shadcn/ui CSS 变量桥接

#### 4.6.1 设计原则

shadcn/ui 组件期望一组特定的 CSS 变量名（如 `--background`、`--primary`、`--destructive` 等）。这些变量名与现有 design-tokens 变量名不同，但语义对应。

通过桥接映射，让 shadcn/ui 变量**引用** `--theme-*` 运行时变量，确保主题切换时自动联动，无需重复维护两套值。

> **关键约束**：桥接变量必须引用 `--theme-*` 运行时变量（由 `applyThemeToDocument()` 在主题切换时更新），**禁止**引用 `--color-*` 静态 token（静态 token 在 light/dark 模式下值不变，会导致暗色模式失效）。

#### 4.6.2 新增文件

`packages/design-tokens/src/shadcn-bridge.ts`

#### 4.6.3 桥接映射表

| shadcn/ui 变量             | 引用来源                            | 说明                     |
| -------------------------- | ----------------------------------- | ------------------------ |
| `--background`             | `var(--theme-color-bg-page)`        | 页面背景（运行时切换）   |
| `--foreground`             | `var(--theme-color-text-primary)`   | 主文本色（运行时切换）   |
| `--card`                   | `var(--theme-color-bg-card)`        | 卡片背景（运行时切换）   |
| `--card-foreground`        | `var(--theme-color-text-primary)`   | 卡片文本                 |
| `--popover`                | `var(--theme-color-bg-elevated)`    | 弹出层背景（运行时切换） |
| `--popover-foreground`     | `var(--theme-color-text-primary)`   | 弹出层文本               |
| `--primary`                | `var(--theme-color-brand-primary)`  | 主色（运行时切换）       |
| `--primary-foreground`     | `#ffffff`                           | 主色上的文本（固定）     |
| `--secondary`              | `var(--theme-color-bg-card)`        | 次要色背景               |
| `--secondary-foreground`   | `var(--theme-color-text-primary)`   | 次要色文本               |
| `--muted`                  | `var(--theme-color-bg-card)`        | 弱化背景                 |
| `--muted-foreground`       | `var(--theme-color-text-secondary)` | 弱化文本                 |
| `--accent`                 | `var(--theme-color-bg-hover)`       | 强调背景（运行时切换）   |
| `--accent-foreground`      | `var(--theme-color-text-primary)`   | 强调文本                 |
| `--destructive`            | `var(--theme-color-destructive)`    | 危险色（运行时切换）     |
| `--destructive-foreground` | `#ffffff`                           | 危险色文本（固定）       |
| `--border`                 | `var(--theme-color-border)`         | 边框色（运行时切换）     |
| `--input`                  | `var(--theme-color-border)`         | 输入框边框               |
| `--ring`                   | `var(--theme-color-border-focus)`   | 聚焦环色（运行时切换）   |

桥接变量统一由 `to-css.ts` 的 `generateCssVarsString()` 输出，确保在 `:root` 中同时包含 design-tokens 变量和 shadcn/ui 桥接变量。

#### 4.6.4 变量链路

```
Tailwind 工具类 (bg-primary)
  → CSS 变量 (--primary)
    → 桥接映射 (--primary: var(--theme-color-brand-primary))
      → 运行时主题变量 (--theme-color-brand-primary: #1677ff / #69b1ff)
        → applyThemeToDocument() 在主题切换时重新注入
```

主题切换时，`applyThemeToDocument` 重新注入 `--color-primary` 的值，`--primary` 通过 `var()` 引用自动更新，shadcn/ui 组件视觉无需额外处理。

---

## 5. shadcn/ui 基础设施

### 5.1 依赖安装

在 `packages/shared-ui/package.json` 中新增以下依赖：

**核心工具：**

| 包名                       | 版本   | 用途                  |
| -------------------------- | ------ | --------------------- |
| `class-variance-authority` | `^0.7` | 变体管理（cva）       |
| `clsx`                     | `^2.1` | 条件类名合并          |
| `tailwind-merge`           | `^2.5` | Tailwind 类名智能合并 |

**Radix UI 原语（按组件需要）：**

| 包名                            | 用途               |
| ------------------------------- | ------------------ |
| `@radix-ui/react-slot`          | 多态渲染 (asChild) |
| `@radix-ui/react-separator`     | Separator          |
| `@radix-ui/react-dialog`        | Dialog             |
| `@radix-ui/react-alert-dialog`  | AlertDialog        |
| `@radix-ui/react-dropdown-menu` | DropdownMenu       |
| `@radix-ui/react-popover`       | Popover            |
| `@radix-ui/react-select`        | Select             |
| `@radix-ui/react-tabs`          | Tabs               |
| `@radix-ui/react-tooltip`       | Tooltip            |
| `@radix-ui/react-checkbox`      | Checkbox           |
| `@radix-ui/react-radio-group`   | RadioGroup         |
| `@radix-ui/react-switch`        | Switch             |
| `@radix-ui/react-avatar`        | Avatar             |
| `@radix-ui/react-progress`      | Progress           |
| `@radix-ui/react-scroll-area`   | ScrollArea         |
| `@radix-ui/react-accordion`     | Accordion          |
| `@radix-ui/react-toast`         | Toast              |
| `@radix-ui/react-toggle`        | Toggle             |
| `@radix-ui/react-toggle-group`  | ToggleGroup        |
| `@radix-ui/react-collapsible`   | Collapsible        |
| `@radix-ui/react-slider`        | Slider             |
| `@radix-ui/react-aspect-ratio`  | AspectRatio        |

**额外依赖（peer，按需引入）：**

| 包名                  | 用途                 | 安装方式       |
| --------------------- | -------------------- | -------------- |
| `cmdk`                | Command 命令面板组件 | peerDependency |
| `vaul`                | Drawer 抽屉组件      | peerDependency |
| `react-hook-form`     | Form 表单组件        | peerDependency |
| `@hookform/resolvers` | 表单校验适配器       | peerDependency |
| `zod`                 | Schema 校验          | peerDependency |

> **依赖策略**：`cmdk`、`vaul`、`react-hook-form`、`zod` 以 **peerDependency** 形式声明，由宿主应用按需安装。`shared-ui` 的 Form/Command/Drawer 组件在对应 peer 未安装时不可用（import 时会报错），但不影响其他组件的使用。这避免了强制所有消费者安装这些相对重型的依赖。

所有新增依赖须同步添加到 `pnpm-workspace.yaml` 的 `catalog` 中统一管理。

### 5.2 cn() 工具函数

新建 `packages/shared-ui/src/lib/utils.ts`：

```ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

这是 shadcn/ui 标准工具函数，功能：

- `clsx`：条件类名拼接（`cn('foo', condition && 'bar')` → `'foo bar'`）
- `twMerge`：智能合并 Tailwind 冲突类名（`cn('px-4', 'px-2')` → `'px-2'`）

### 5.3 components.json 配置

新建 `packages/shared-ui/components.json`：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "../../apps/react-app/tailwind.config.ts",
    "css": "src/style.css",
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
  }
}
```

说明：

- `style: "default"` — 更圆润柔和的风格，用户选定
- `rsc: false` — 非 Next.js RSC 项目
- `cssVariables: true` — 使用 CSS 变量主题
- `baseColor: "slate"` — 基色为 slate 系

### 5.4 路径别名

- `packages/shared-ui/tsconfig.json` 添加 `paths: { "@/*": ["./src/*"] }`
- `packages/shared-ui/vite.config.ts` 添加 `resolve.alias: { '@': path.resolve(__dirname, 'src') }`
- 确保 vitest 配置同步

### 5.5 Tailwind CSS 内容路径

`apps/react-app` 的 Tailwind 配置已使用 `../../packages/shared-ui/src/**/*.{ts,tsx,css}` 覆盖 shared-ui 目录，新增 `components/ui/` 子目录无需额外配置。

### 5.6 共存策略

现有 `.repo-*` 组件与新 shadcn/ui 组件在过渡期内共存：

| 方面 | 现有 `.repo-*` 组件         | 新 shadcn/ui 组件                                |
| ---- | --------------------------- | ------------------------------------------------ |
| 位置 | `components/*.tsx`          | `components/ui/*.tsx`                            |
| 样式 | `style.css` (BEM 类名)      | Tailwind 工具类 + `cn()`                         |
| 变体 | `data-*` 属性 + CSS         | `cva` 变体管理                                   |
| 主题 | CSS 变量 (`var(--theme-*)`) | CSS 变量 (`var(--background)` 等)                |
| 导出 | `components/index.ts`       | `components/ui/index.ts` → `components/index.ts` |

**原则**：

- 不破坏现有消费者，现有组件 API 不变
- 新功能优先使用 shadcn/ui 组件
- 后续迭代渐进将现有组件迁移至 shadcn/ui，迁移完成后移除对应 `.repo-*` CSS 规则
- 两套组件可同时出现在同一页面

**迁移优先级判断原则**：

| 优先级     | 条件                                        | 示例                                                                     |
| ---------- | ------------------------------------------- | ------------------------------------------------------------------------ |
| **高**     | 与 shadcn/ui 新组件功能重叠                 | `StatusTag` → `Badge`；`TabWorkspace` → `Tabs`                           |
| **中**     | 内部实现可简化（用 Radix 原语替代手写逻辑） | `EmptyState`（可组合 Card + Button）；`FilterBar`（可组合 flex + Input） |
| **低**     | 布局/结构级组件，迁移风险大                 | `AdminShell`、`TopNav`、`SideMenu`、`AppBreadcrumb`                      |
| **不迁移** | 平台特有逻辑（权限、主题切换）              | `PermissionGate`、`ThemeModeSwitch`                                      |

迁移后旧组件标记 `@deprecated` JSDoc 注解，保留一个主版本后移除。

---

## 6. 组件封装设计

### 6.1 组件实现规范

每个 shadcn/ui 组件遵循以下规范：

**文件位置**：`packages/shared-ui/src/components/ui/<name>.tsx`

**代码结构**（以 Button 为例）：

```tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // 基础类 — 所有变体共享
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
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

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
```

**强制约束**：

1. 使用 `React.forwardRef` 支持引用转发
2. 使用 `cva` 管理变体，禁止手动拼接条件类名
3. 使用 `cn()` 合并类名，禁止直接模板字符串拼接
4. 导出组件 + variants（如 `buttonVariants`）供组合使用
5. 支持 `asChild` 多态渲染模式（Radix UI Slot 模式）— **仅限需要多态的组件**（如 Button、Dialog.Trigger），纯展示组件（如 Badge、Separator）不需要
6. 颜色全部引用 CSS 变量（`bg-primary` → `var(--primary)`），禁止硬编码
7. 过渡引用 motion token（`transition-colors` → 由 Tailwind 解析）
8. 每个组件文件包含完整的 TypeScript 类型声明

**无障碍 (a11y) 约束**：

9. 所有交互组件必须支持键盘导航（Tab 聚焦、Enter/Space 激活、Escape 关闭）
10. Radix UI 原语已内置 ARIA 属性和焦点管理，自定义组件须补充对应属性
11. Dialog/AlertDialog 打开后焦点陷阱，关闭后焦点返回触发元素
12. 颜色对比度须满足 WCAG AA 标准（正文 ≥ 4.5:1，大文本 ≥ 3:1）
13. 禁止仅依赖颜色传达信息，须辅以图标或文本

### 6.2 Tier 1 — 核心组件

所有页面必需的基础组件，共 6 个。

| 组件          | Radix 原语                  | Props 要点                                                                        | 变体                                                                                                |
| ------------- | --------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Button**    | `@radix-ui/react-slot`      | `variant`, `size`, `asChild`                                                      | variant: default / destructive / outline / secondary / ghost / link; size: default / sm / lg / icon |
| **Input**     | — (原生)                    | `type`, `size`, `disabled`, `error`                                               | size: default / sm / lg                                                                             |
| **Label**     | — (原生)                    | `htmlFor`, `required`                                                             | —                                                                                                   |
| **Card**      | — (原生)                    | 子组件: `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | —                                                                                                   |
| **Badge**     | — (原生)                    | `variant`                                                                         | variant: default / secondary / destructive / outline                                                |
| **Separator** | `@radix-ui/react-separator` | `orientation`                                                                     | orientation: horizontal / vertical                                                                  |

### 6.3 Tier 2 — 重要组件

CRUD 视图必需的交互组件，共 12 个。

| 组件             | Radix 原语                      | Props 要点                                                         | 变体                                                              |
| ---------------- | ------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **Select**       | `@radix-ui/react-select`        | `value`, `onValueChange`, `disabled`, `placeholder`                | size: default / sm / lg                                           |
| **Checkbox**     | `@radix-ui/react-checkbox`      | `checked`, `onCheckedChange`, `disabled`                           | —                                                                 |
| **RadioGroup**   | `@radix-ui/react-radio-group`   | `value`, `onValueChange`, `disabled`                               | —                                                                 |
| **Switch**       | `@radix-ui/react-switch`        | `checked`, `onCheckedChange`, `disabled`                           | —                                                                 |
| **Textarea**     | — (原生)                        | `rows`, `disabled`, `error`                                        | —                                                                 |
| **Dialog**       | `@radix-ui/react-dialog`        | `open`, `onOpenChange`                                             | 子组件: Trigger / Content / Header / Footer / Title / Description |
| **AlertDialog**  | `@radix-ui/react-alert-dialog`  | `open`, `onOpenChange`                                             | 子组件: 同 Dialog + Action / Cancel                               |
| **DropdownMenu** | `@radix-ui/react-dropdown-menu` | 子组件: Trigger / Content / Item / Separator / Label / Group / Sub | —                                                                 |
| **Tooltip**      | `@radix-ui/react-tooltip`       | `content`, `side`, `align`, `delayDuration`                        | —                                                                 |
| **Popover**      | `@radix-ui/react-popover`       | `open`, `onOpenChange`                                             | 子组件: Trigger / Content                                         |
| **Table**        | — (原生)                        | 子组件: Header / Body / Row / Head / Cell                          | —                                                                 |
| **Tabs**         | `@radix-ui/react-tabs`          | `defaultValue`, `value`, `onValueChange`                           | 子组件: List / Trigger / Content                                  |

### 6.4 Tier 3 — 高级组件

锦上添花的高级组件，共 14 个。

| 组件            | Radix 原语                     | Props 要点                                              | 备注                                                              |
| --------------- | ------------------------------ | ------------------------------------------------------- | ----------------------------------------------------------------- |
| **Avatar**      | `@radix-ui/react-avatar`       | `src`, `alt`, `fallback`                                | 子组件: Image / Fallback                                          |
| **Progress**    | `@radix-ui/react-progress`     | `value`, `max`                                          | —                                                                 |
| **ScrollArea**  | `@radix-ui/react-scroll-area`  | `orientation`                                           | 子组件: Viewport / ScrollBar / Thumb                              |
| **Accordion**   | `@radix-ui/react-accordion`    | `type`, `collapsible`                                   | 子组件: Item / Trigger / Content                                  |
| **Toast**       | `@radix-ui/react-toast`        | `duration`, `variant`                                   | 含 ToastProvider / ToastViewport / useToast hook                  |
| **Toggle**      | `@radix-ui/react-toggle`       | `pressed`, `onPressedChange`, `variant`, `size`         | variant: default / outline; size: default / sm / lg               |
| **ToggleGroup** | `@radix-ui/react-toggle-group` | `type`, `value`, `onValueChange`                        | type: single / multiple                                           |
| **Collapsible** | `@radix-ui/react-collapsible`  | `open`, `onOpenChange`                                  | 子组件: Trigger / Content                                         |
| **Slider**      | `@radix-ui/react-slider`       | `value`, `onValueChange`, `min`, `max`, `step`          | —                                                                 |
| **Pagination**  | — (自定义)                     | `page`, `pageSize`, `total`, `onChange`                 | —                                                                 |
| **Skeleton**    | — (自定义)                     | `className`                                             | CSS 动画占位                                                      |
| **Drawer**      | `vaul`                         | `direction`, `open`, `onOpenChange`                     | 子组件: Trigger / Content / Header / Footer / Title / Description |
| **Command**     | `cmdk`                         | 子组件: Input / List / Empty / Group / Item / Separator | 命令面板                                                          |
| **Form**        | `react-hook-form` + `zod`      | `form`, `onSubmit`                                      | 子组件: Field / Label / Control / Description / Message           |

### 6.5 组件导出结构

```
packages/shared-ui/src/
  components/
    ui/                         # shadcn/ui 组件
      button.tsx
      input.tsx
      label.tsx
      card.tsx
      badge.tsx
      separator.tsx
      select.tsx
      checkbox.tsx
      radio-group.tsx
      switch.tsx
      textarea.tsx
      dialog.tsx
      alert-dialog.tsx
      dropdown-menu.tsx
      tooltip.tsx
      popover.tsx
      table.tsx
      tabs.tsx
      avatar.tsx
      progress.tsx
      scroll-area.tsx
      accordion.tsx
      toast.tsx
      toggle.tsx
      toggle-group.tsx
      collapsible.tsx
      slider.tsx
      pagination.tsx
      skeleton.tsx
      drawer.tsx
      command.tsx
      form.tsx
      index.ts                  # barrel: export all ui components
    AppShell.tsx                 # 现有 .repo-* 组件（不变）
    AdminShell.tsx
    TopNav.tsx
    SideMenu.tsx
    AppBreadcrumb.tsx
    TabWorkspace.tsx
    PageContainer.tsx
    PageHeader.tsx
    DataPanel.tsx
    MetricCard.tsx
    FilterBar.tsx
    EmptyState.tsx
    StatusTag.tsx
    ThemeModeSwitch.tsx
    ExceptionState.tsx
    PermissionGate.tsx
    index.ts                     # 导出 ui/ + 现有组件
  lib/
    utils.ts                     # cn()
  hooks/
    useThemeSnapshot.ts          # 现有
    useThemeMode.ts              # 现有
  provider/
    ThemeProvider.tsx             # 现有
  style.css                      # 现有 .repo-* 样式
  index.ts                       # 包入口
```

---

## 7. 组件展示设计

### 7.1 路由

在 `apps/react-app/src/router/` 新增路由：

```
/components → ComponentShowcaseView
```

该路由为开发辅助页面，通过菜单入口可访问，但不纳入生产部署的正式菜单体系。

### 7.2 页面结构

```
ComponentShowcaseView
├── ThemeShowcase          — 主题切换 + 色板 + 排版
├── ButtonShowcase         — 按钮变体矩阵
├── FormShowcase           — 表单控件组合
├── DataDisplayShowcase    — 数据展示组件
├── FeedbackShowcase       — 反馈组件
├── NavigationShowcase     — 导航组件
└── AdvancedShowcase       — 高级组件
```

### 7.3 各展示分区内容

#### ThemeShowcase

- **模式切换器**：使用现有 `ThemeModeSwitch` 组件，切换 light/dark/system
- **主题名切换器**：新增下拉选择，切换 default/compact
- **色板网格**：网格展示所有 CSS 变量色值，每个色块显示变量名和当前计算值
- **排版刻度**：按 `fontSize` token 渲染不同字号文本

#### ButtonShowcase

- 变体 × 尺寸矩阵：6 个 variant × 4 个 size = 24 种组合
- 禁用态展示
- `asChild` 组合用法
- 与旧 `.page-primary-button` 的对照说明

#### FormShowcase

- Input 各 size + 禁用/错误态
- Select 下拉选择
- Checkbox / RadioGroup / Switch
- Textarea
- 完整表单示例（含校验）

#### DataDisplayShowcase

- Card 各子组件组合
- Badge 各 variant
- Table 基础表格（使用与 UserListView 同源数据）
- Avatar + Tooltip + Popover

#### FeedbackShowcase

- Dialog / AlertDialog 触发按钮
- Toast 通知示例
- Progress 进度条
- Skeleton 加载占位
- Drawer 侧面板

#### NavigationShowcase

- Tabs 受控 / 非受控
- Pagination 分页

#### AdvancedShowcase

- Command 命令面板
- Accordion / Collapsible
- ScrollArea / Slider
- Form 完整校验表单

### 7.4 辅助组件

**ShowcaseSection**：分区容器，基于 `DataPanel` 实现。

```tsx
interface ShowcaseSectionProps {
  title: string
  description?: string
  children: ReactNode
}
```

**ComponentRow**：单组件行标注。

```tsx
interface ComponentRowProps {
  label: string
  children: ReactNode
}
```

**CodeBlock**：代码示例展示组件，用于展示每个组件的用法代码片段。

```tsx
interface CodeBlockProps {
  code: string // 源代码字符串
  language?: string // 语法高亮语言，默认 'tsx'
}
```

每个展示分区应包含：

1. **实时渲染**的组件
2. 对应的**源代码片段**（通过 CodeBlock 展示，可复制）
3. 关键 **Props 说明**

这使展示页不仅是视觉参考，更是开发者可复制粘贴的用法文档。

### 7.5 主题切换增强

扩展 `apps/react-app/src/stores/theme.ts`：

- 新增 `themeName: ThemeName` 状态，默认 `'default'`
- 新增 `setThemeName(name: ThemeName)` action
- `setThemeName` 调用 `applyThemeToDocument()` 重新注入 CSS 变量
- 在 ThemeProvider 中同步更新 context value

展示页面可通过切换器实时观察所有组件在 default/compact 主题和 light/dark 模式下的视觉差异。

---

## 8. 正式契约

### 8.1 设计令牌契约

- 新增 token 模块遵循现有 `as const` + `to-css.ts` 生成模式
- `transitions.ts` 从 `motion.ts` 派生，禁止独立定义 duration/easing 值
- 颜色系统新增字段中，**静态不变的**（如 `primaryScale`、`secondary` 系列色值）作为静态 token 输出；**light/dark 模式下值不同的**（如交互态颜色 `colorBgHover`/`colorBgPressed` 等）必须纳入 ThemeSnapshot 作为运行时可切换字段
- ThemeSnapshot 新增字段均为**运行时可切换**（通过 `--theme-*` CSS 变量注入）
- 暗色主题通过 `deriveDarkFromLight()` 派生，禁止手动维护暗色快照；派生函数须正确处理交互态颜色的反转（`rgba(0,0,0,*)` → `rgba(255,255,255,*)`）
- 桥接变量 (`--background`, `--primary` 等) 始终通过 `var(--theme-*)` 引用运行时变量，禁止引用 `var(--color-*)` 静态 token 或重复声明值
- `error` 用于状态展示，`destructive` 用于危险操作，两者同属红色系但语义不同

### 8.2 组件库契约

- 所有新组件必须使用 shadcn/ui 模式（`forwardRef` + `cva` + `cn()`）
- `asChild` 仅限需要多态渲染的组件（Button、Dialog.Trigger 等），纯展示组件不需要
- 组件样式全部通过 CSS 变量和 Tailwind 工具类控制，禁止硬编码颜色/字号
- 组件文件放入 `packages/shared-ui/src/components/ui/`，通过 barrel export 对外暴露
- 现有 `.repo-*` 组件 API 不变，直到显式迁移
- 每个组件必须包含完整的 TypeScript 类型声明
- 所有交互组件必须支持键盘导航和 ARIA 无障碍属性

### 8.3 依赖契约

- `shared-ui` 新增 `@radix-ui/*`、`cva`、`clsx`、`tailwind-merge`、`lucide-react` 为 dependencies
- `cmdk`、`vaul`、`react-hook-form`、`@hookform/resolvers`、`zod` 为 **peerDependencies**，由宿主应用按需安装
- 所有新增 dependencies 须在 `pnpm-workspace.yaml` catalog 中注册
- `shared-service` 禁止依赖 `@radix-ui/*`、`clsx`、`tailwind-merge` 等 UI 依赖

### 8.4 展示页契约

- 展示页路由 `/components` 仅在开发环境可访问
- 展示页组件放入 `apps/react-app/src/views/showcase/`
- 展示页不引入额外生产依赖

---

## 9. 验收标准

- `pnpm build:shared && pnpm build:react` 全量构建通过
- `pnpm typecheck` 类型检查无错误
- `pnpm test` 所有测试通过（含新增 token 测试、derive-dark 测试、组件渲染测试）
- `pnpm dev` 启动后访问 `/components`，所有组件正确渲染
- 主题模式切换 (light/dark/system) 所有组件视觉正确切换
- 主题名切换 (default/compact) 间距和圆角变化可见
- 暗色主题文本对比度 ≥ 4.5:1 (WCAG AA)
- 桥接变量引用 `--theme-*` 运行时变量，暗色模式下 shadcn/ui 组件视觉正确
- 现有 `.repo-*` 组件功能不受影响
- 所有交互组件可通过键盘操作（Tab 聚焦、Enter/Space 激活、Escape 关闭 Dialog）
- Tier 1 + Tier 2 组件增量 bundle ≤ 50KB gzip（不含 peer 依赖）

---

## 10. 与上游设计的关系

| 上游文档                         | 本文档对应关系                                                        |
| -------------------------------- | --------------------------------------------------------------------- |
| 架构设计方案 ADR-003             | 本文档 §5-6 是 ADR-003 的具体落地设计                                 |
| 架构设计方案 §6.3 shared-ui      | 本文档 §6 扩展了组件封装模式                                          |
| Phase0 详细设计 §4 主题与共享 UI | 本文档 §4 扩展了 token 类别和主题变体，§4.6 新增了 shadcn/ui 桥接契约 |
| Phase0 详细设计 §4.3 正式契约    | 本文档 §8 新增了组件库和依赖契约                                      |
