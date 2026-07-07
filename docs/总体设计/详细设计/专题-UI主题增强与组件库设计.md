# UI 主题增强与组件库设计

> 制定日期：2026-06-26
> 最近修订：2026-07-07
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
- Drawer / Command / Form / Steps 组件（前三个 peer 依赖 `vaul`、`cmdk`、`react-hook-form` 已声明但宿主应用未安装；Steps 为自定义组件待实现）

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

#### 4.2.5 明暗主题色值规范

> **设计目标**：不依赖外部组件库，建立一套本项目自有的明暗双主题。亮色主题以白色表面为主，暗色主题保持相同品牌色相，通过中性色反色确保可读性。

所有运行时可切换颜色均通过 `ThemeSnapshot` 暴露，生成 `--theme-*` 运行时变量。暗色主题由 `deriveDarkFromLight()` 从亮色快照自动派生，禁止单独硬编码维护暗色快照。

##### 设计原则

1. **品牌色相统一**：light 与 dark 使用相同品牌主色，只在背景/文本/边框等中性色上区分。
2. **暗色表面三层**：页面 `#141414`、卡片 `#1f1f1f`、浮层 `#262626`。
3. **交互态叠加方向反转**：亮色使用 `rgba(0,0,0,*)` 压暗，暗色使用 `rgba(255,255,255,*)` 提亮。
4. **语义色适度提亮**：暗色模式下 success / warning / error / info 适度提亮，保持对比度。
5. **阴影在暗色下加重**：方向不变，透明度提高，保证暗背景上 elevation 可辨。

> **注意**：`ThemeSnapshot` 只包含实际运行时切换所需的字段。以下表格中仅列出 `ThemeSnapshot` 中存在的字段；`colors.ts` 中定义、但未进入 `ThemeSnapshot` 的静态色（如 `colorBgOverlay`、`colorBgBlank`、`colorFill*` 系列等）不纳入本表。

##### 亮色主题色值（default light）

| 字段                      | 色值                       | 说明                                        |
| ------------------------- | -------------------------- | ------------------------------------------- |
| `colorBgPage`             | `#ffffff`                  | 页面背景（来自 `colors.bg.default`）        |
| `colorBgCard`             | `#ffffff`                  | 卡片/默认表面（来自 `colors.bg.container`） |
| `colorBgElevated`         | `#ffffff`                  | 提升表面（来自 `colors.bg.elevated`）       |
| `colorTextPrimary`        | `rgba(0, 0, 0, 0.88)`      | 主文本                                      |
| `colorTextSecondary`      | `rgba(0, 0, 0, 0.65)`      | 次要文本                                    |
| `colorTextMuted`          | `rgba(0, 0, 0, 0.45)`      | 辅助文本                                    |
| `colorBorder`             | `#d9d9d9`                  | 默认边框（来自 `colors.border.default`）    |
| `colorBorderStrong`       | `#bfbfbf`                  | 强调边框（来自 `colors.neutral[400]`）      |
| `colorBrandPrimary`       | `#1677ff`                  | 品牌主色                                    |
| `colorBrandPrimaryHover`  | `#4096ff`                  | 主色 hover                                  |
| `colorBrandPrimaryActive` | `#0958d9`                  | 主色 active                                 |
| `colorSuccess`            | `#52c41a`                  | 成功                                        |
| `colorWarning`            | `#faad14`                  | 警告                                        |
| `colorError`              | `#ff4d4f`                  | 错误                                        |
| `colorInfo`               | `#1677ff`                  | 信息                                        |
| `shadowPanel`             | `shadows.base`             | 面板阴影                                    |
| `shadowRaised`            | `shadows.lg`               | 强提升阴影                                  |
| `radiusSm`                | `2px`                      | 小圆角                                      |
| `radiusMd`                | `6px`                      | 中圆角                                      |
| `radiusLg`                | `8px`                      | 大圆角                                      |
| `spacingPanelX`           | `24px`                     | 面板水平间距                                |
| `spacingPanelY`           | `24px`                     | 面板垂直间距                                |
| `colorBgHover`            | `rgba(0, 0, 0, 0.04)`      | 悬停背景                                    |
| `colorBgPressed`          | `rgba(0, 0, 0, 0.08)`      | 按下背景                                    |
| `colorBgSelected`         | `rgba(22, 119, 255, 0.08)` | 选中背景                                    |
| `colorBorderHover`        | `#bfbfbf`                  | 悬停边框                                    |
| `colorBorderFocus`        | `#1677ff`                  | 聚焦环色                                    |
| `colorDestructive`        | `#ef4444`                  | 危险色                                      |
| `colorDestructiveHover`   | `#dc2626`                  | 危险色 hover                                |
| `colorDestructivePressed` | `#b91c1c`                  | 危险色 pressed                              |

##### 暗色主题色值（default dark）

| 字段                      | 色值                        | 说明                            |
| ------------------------- | --------------------------- | ------------------------------- |
| `colorBgPage`             | `#141414`                   | 页面背景                        |
| `colorBgCard`             | `#1f1f1f`                   | 卡片/默认表面                   |
| `colorBgElevated`         | `#262626`                   | 提升表面                        |
| `colorTextPrimary`        | `#e8e8e8`                   | 主文本                          |
| `colorTextSecondary`      | `#bfbfbf`                   | 次要文本                        |
| `colorTextMuted`          | `#8c8c8c`                   | 辅助文本                        |
| `colorBorder`             | `#434343`                   | 默认边框                        |
| `colorBorderStrong`       | `#595959`                   | 强调边框                        |
| `colorBrandPrimary`       | `#1677ff`                   | 品牌主色（与 light 一致）       |
| `colorBrandPrimaryHover`  | `#69b1ff`                   | 主色 hover（提亮）              |
| `colorBrandPrimaryActive` | `#0958d9`                   | 主色 active                     |
| `colorSuccess`            | `#73d13d`                   | 成功（提亮）                    |
| `colorWarning`            | `#ffc53d`                   | 警告（提亮）                    |
| `colorError`              | `#ff7875`                   | 错误（提亮）                    |
| `colorInfo`               | `#69b1ff`                   | 信息（提亮）                    |
| `shadowPanel`             | 见 §4.2.6                   | 面板阴影（透明度加重）          |
| `shadowRaised`            | 见 §4.2.6                   | 强提升阴影（透明度加重）        |
| `radiusSm`                | `2px`                       | 小圆角                          |
| `radiusMd`                | `6px`                       | 中圆角                          |
| `radiusLg`                | `8px`                       | 大圆角                          |
| `spacingPanelX`           | `24px`                      | 面板水平间距                    |
| `spacingPanelY`           | `24px`                      | 面板垂直间距                    |
| `colorBgHover`            | `rgba(255, 255, 255, 0.08)` | 背景 hover（方向反转）          |
| `colorBgPressed`          | `rgba(255, 255, 255, 0.12)` | 背景 pressed（方向反转）        |
| `colorBgSelected`         | `rgba(22, 119, 255, 0.16)`  | 选中态（透明度加深）            |
| `colorBorderHover`        | `#434343`                   | 边框 hover                      |
| `colorBorderFocus`        | `#69b1ff`                   | 边框 focus（提亮）              |
| `colorDestructive`        | `#ef4444`                   | 危险色（与 light 一致）         |
| `colorDestructiveHover`   | `#dc2626`                   | 危险色 hover（与 light 一致）   |
| `colorDestructivePressed` | `#b91c1c`                   | 危险色 pressed（与 light 一致） |

##### 4.2.6 阴影色值

`shadows.ts` 当前定义五级通用阴影：`sm`、`base`、`md`、`lg`、`xl`。`ThemeSnapshot` 只引用其中 `shadowPanel`（映射到 `shadows.base`）和 `shadowRaised`（映射到 `shadows.lg`）两个字段用于运行时切换。暗色模式下由 `deriveDarkFromLight()` 提高透明度以保证暗背景可见。

| Token          | Light（`shadows.ts` 原始值）                                             | Dark（`deriveDarkFromLight` 调整后）                                |
| -------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `shadowPanel`  | `0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)`      | `0 1px 2px 0 rgba(0, 0, 0, 0.35), 0 1px 3px 0 rgba(0, 0, 0, 0.25)`  |
| `shadowRaised` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` | `0 4px 12px 0 rgba(0, 0, 0, 0.35), 0 2px 6px 0 rgba(0, 0, 0, 0.25)` |

> **说明**：`shadowLight`、`shadowLighter`、`shadowDark` 等 Token 当前未在 `shadows.ts` 中定义，也未进入 `ThemeSnapshot`。如需扩展，应在 `shadows.ts` 新增静态 token 后再在 `ThemeSnapshot` 中引用。当前设计文档中关于这些字段的表格属于超前规划，与实现不符，已删除。

### 4.3 暗色主题自动派生

#### 4.3.1 设计原则

- 暗色主题由亮色主题**自动派生**，新增主题变体时只需定义亮色快照，暗色自动生成
- 派生函数为纯函数，输入 `ThemeSnapshot`，输出 `ThemeSnapshot`，不修改输入
- 暗色值通过**直接映射**而非运行时叠印算法生成，色值在 `deriveDarkFromLight()` 中显式声明，确保可审计、可测试
- 交互态叠加方向反转：亮色 `rgba(0,0,0,*)` → 暗色 `rgba(255,255,255,*)`

#### 4.3.2 派生规则

以下为 `deriveDarkFromLight()` 的实际派生映射，与 `packages/design-tokens/src/theme/derive-dark.ts` 保持一致：

| 字段                      | 派生规则                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| `colorBgPage`             | 固定 `#141414`（`neutral[900]` 近似）                                     |
| `colorBgCard`             | 固定 `#1f1f1f`（`neutral[800]` + 微调）                                   |
| `colorBgElevated`         | 固定 `#262626`（`neutral[700]`）                                          |
| `colorTextPrimary`        | 固定 `#e8e8e8`（反色层级最高对比度）                                      |
| `colorTextSecondary`      | 固定 `#bfbfbf`                                                            |
| `colorTextMuted`          | 固定 `#8c8c8c`                                                            |
| `colorBorder`             | 固定 `#434343`（`neutral[700]`）                                          |
| `colorBorderStrong`       | 固定 `#595959`（`neutral[600]`）                                          |
| `colorBrandPrimary`       | 保持与 light 一致 `#1677ff`                                               |
| `colorBrandPrimaryHover`  | 提亮 `#69b1ff`                                                            |
| `colorBrandPrimaryActive` | 保持 `#0958d9`                                                            |
| `colorSuccess`            | 提亮 `#73d13d`                                                            |
| `colorWarning`            | 提亮 `#ffc53d`                                                            |
| `colorError`              | 提亮 `#ff7875`                                                            |
| `colorInfo`               | 提亮 `#69b1ff`（同 `colorBrandPrimaryHover`）                             |
| `colorBgHover`            | 反转方向 `rgba(255, 255, 255, 0.08)`                                      |
| `colorBgPressed`          | 反转方向 `rgba(255, 255, 255, 0.12)`                                      |
| `colorBgSelected`         | 加深透明度 `rgba(22, 119, 255, 0.16)`                                     |
| `colorBorderHover`        | 固定 `#434343`（同 `colorBorder`）                                        |
| `colorBorderFocus`        | 提亮 `#69b1ff`（同 `colorBrandPrimaryHover`）                             |
| `colorDestructive`        | 保持与 light 一致 `#ef4444`                                               |
| `colorDestructiveHover`   | 保持与 light 一致 `#dc2626`                                               |
| `colorDestructivePressed` | 保持与 light 一致 `#b91c1c`                                               |
| `shadowPanel`             | 提高透明度：`0 1px 2px 0 rgba(0,0,0,0.35), 0 1px 3px 0 rgba(0,0,0,0.25)`  |
| `shadowRaised`            | 提高透明度：`0 4px 12px 0 rgba(0,0,0,0.35), 0 2px 6px 0 rgba(0,0,0,0.25)` |

> **设计说明**：早期设计曾使用 `mixHex()` 叠印公式（`Result = Upper * alpha + Base * (1 - alpha)`）动态计算暗色值，但实现中选择了直接硬编码映射，原因：(1) 色值可审计、可测试；(2) 避免运行时计算开销；(3) `write-theme-init.mjs` 同步维护时无需复现叠印逻辑。如后续需增加更多暗色字段，可在 `deriveDarkFromLight()` 中新增映射行。

#### 4.3.3 文件

`packages/design-tokens/src/theme/derive-dark.ts`（已实现）

#### 4.3.4 注册表

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

`packages/shared-utils/src/ui-contract/index.ts`：

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
- `packages/shared-utils/src/ui-contract/index.ts` 类型契约（如需新增类型）

### 4.6 shadcn/ui CSS 变量桥接

#### 4.6.1 设计原则

shadcn/ui 组件期望一组特定的 CSS 变量名（如 `--background`、`--primary`、`--destructive` 等）。这些变量名与现有 design-tokens 变量名不同，但语义对应。

通过桥接映射，让 shadcn/ui 变量**引用** `--theme-*` 运行时变量，确保主题切换时自动联动，无需重复维护两套值。

> **关键约束**：桥接变量必须引用 `--theme-*` 运行时变量（由 `applyThemeToDocument()` 在主题切换时更新），**禁止**引用 `--color-*` 静态 token（静态 token 在 light/dark 模式下值不变，会导致暗色模式失效）。

#### 4.6.2 文件

`packages/design-tokens/src/shadcn-bridge.ts`（已实现）

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
| `--radius`                 | `var(--theme-radius-md)`            | 默认圆角（运行时切换）   |

桥接变量统一由 `to-css.ts` 的 `generateCssVarsString()` 输出，确保在 `:root` 中同时包含 design-tokens 变量和 shadcn/ui 桥接变量。

#### 4.6.4 变量链路

```
Tailwind 工具类 (bg-primary)
  → CSS 变量 (--primary)
    → 桥接映射 (--primary: var(--theme-color-brand-primary))
      → 运行时主题变量 (--theme-color-brand-primary: #1677ff / #69b1ff)
        → applyThemeToDocument() 在主题切换时重新注入
```

主题切换时，`applyThemeToDocument` 重新注入 `--theme-color-brand-primary` 的值，`--primary` 通过 `var()` 引用自动更新，shadcn/ui 组件视觉无需额外处理。

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
| `@radix-ui/react-label`         | Label              |

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

`packages/shared-ui/components.json` 实际配置：

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

说明：

- `style: "new-york"` — New York 风格（相比 default 风格更紧凑、棱角分明）
- `rsc: false` — 非 Next.js RSC 项目
- `cssVariables: true` — 使用 CSS 变量主题
- `baseColor: "slate"` — 基色为 slate 系
- `iconLibrary: "lucide"` — 使用 lucide-react 图标库
- `tailwind.config: ""` — Tailwind 配置由 apps/react-app 统一管理，shared-ui 不独立配置
- `tailwind.css: "../../apps/react-app/src/styles/tailwind.css"` — CSS 入口指向 app 的 Tailwind CSS 文件

### 5.4 路径别名

- `packages/shared-ui/tsconfig.json` 已配置 `paths: { "@/*": ["./src/*"] }`
- `packages/shared-ui/vite.config.ts` 已配置 `resolve.alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }`
- vitest 配置已同步

### 5.4.1 图标库

`lucide-react` 作为全局图标库，覆盖设计稿中展示的全部图标分类（导航、操作、社交、媒体、界面、其他等）。组件内图标通过 `cn()` + Tailwind 尺寸工具类控制，颜色继承 CSS 变量。

### 5.5 Tailwind CSS 内容路径

本项目使用 Tailwind CSS v4（`@tailwindcss/vite`），内容发现为自动扫描机制。`apps/react-app/tailwind.config.ts` 的 `content` 数组包含 `../../packages/shared-ui/src/**/*.{ts,tsx,css}`，确保 shared-ui 中新增的 `components/ui/` 子目录无需额外配置即可被 Tailwind 扫描到工具类。

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
import { cn from '../../lib/utils'

const buttonVariants = cva(
  // 基础类 — 所有变体共享
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
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

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
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

> **React 19 注意**：本项目使用 React 19，组件通过 `ref` prop 接收引用（不再需要 `React.forwardRef` 包裹）。如需在 React 18 项目中使用，需改回 `React.forwardRef` 模式。

**强制约束**：

1. 使用 React 19 `ref` prop 模式支持引用转发（不再使用 `React.forwardRef`）
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

锦上添花的高级组件，共 15 个。其中 Form、Command、Drawer、Steps 为待实现组件。

| 组件            | Radix 原语                     | Props 要点                                              | 状态      | 备注                                                              |
| --------------- | ------------------------------ | ------------------------------------------------------- | --------- | ----------------------------------------------------------------- |
| **Avatar**      | `@radix-ui/react-avatar`       | `src`, `alt`, `fallback`                                | ✅ 已实现 | 子组件: Image / Fallback                                          |
| **Progress**    | `@radix-ui/react-progress`     | `value`, `max`                                          | ✅ 已实现 | —                                                                 |
| **ScrollArea**  | `@radix-ui/react-scroll-area`  | `orientation`                                           | ✅ 已实现 | 子组件: Viewport / ScrollBar / Thumb                              |
| **Accordion**   | `@radix-ui/react-accordion`    | `type`, `collapsible`                                   | ✅ 已实现 | 子组件: Item / Trigger / Content                                  |
| **Toast**       | `@radix-ui/react-toast`        | `duration`, `variant`                                   | ✅ 已实现 | 含 ToastProvider / ToastViewport / useToast hook                  |
| **Toggle**      | `@radix-ui/react-toggle`       | `pressed`, `onPressedChange`, `variant`, `size`         | ✅ 已实现 | variant: default / outline; size: default / sm / lg               |
| **ToggleGroup** | `@radix-ui/react-toggle-group` | `type`, `value`, `onValueChange`                        | ✅ 已实现 | type: single / multiple                                           |
| **Collapsible** | `@radix-ui/react-collapsible`  | `open`, `onOpenChange`                                  | ✅ 已实现 | 子组件: Trigger / Content                                         |
| **Slider**      | `@radix-ui/react-slider`       | `value`, `onValueChange`, `min`, `max`, `step`          | ✅ 已实现 | —                                                                 |
| **Pagination**  | — (自定义)                     | `page`, `pageSize`, `total`, `onChange`                 | ✅ 已实现 | —                                                                 |
| **Skeleton**    | — (自定义)                     | `className`                                             | ✅ 已实现 | CSS 动画占位                                                      |
| **AspectRatio** | `@radix-ui/react-aspect-ratio` | `ratio`                                                 | ✅ 已实现 | —                                                                 |
| **Drawer**      | `vaul`                         | `direction`, `open`, `onOpenChange`                     | ⏳ 待实现 | 子组件: Trigger / Content / Header / Footer / Title / Description |
| **Command**     | `cmdk`                         | 子组件: Input / List / Empty / Group / Item / Separator | ⏳ 待实现 | 命令面板                                                          |
| **Form**        | `react-hook-form` + `zod`      | `form`, `onSubmit`                                      | ⏳ 待实现 | 子组件: Field / Label / Control / Description / Message           |
| **Steps**       | — (自定义)                     | `current`, `direction`, `status`                        | ⏳ 待实现 | 步骤指示器，设计稿中有展示                                        |

> **待实现组件说明**：
>
> - Drawer、Command、Form 的底层库（`vaul`、`cmdk`、`react-hook-form`）以 **peerDependency** 形式声明，当前宿主应用未安装，待业务需要时再安装并实现。
> - Steps 为纯自定义组件（无 Radix 原语），设计稿中有展示，待后续迭代实现。

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
      toaster.tsx
      toggle.tsx
      toggle-group.tsx
      collapsible.tsx
      slider.tsx
      pagination.tsx
      skeleton.tsx
      aspect-ratio.tsx
      # ⏳ 待后续迭代实现
      # drawer.tsx          (vaul)
      # command.tsx         (cmdk)
      # form.tsx            (react-hook-form + zod)
      # steps.tsx           (自定义，设计稿中有展示)
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
├── ThemeShowcase          — 主题切换（light/dark/system + default/compact）
├── ButtonShowcase         — 按钮变体 × 尺寸矩阵
├── InputShowcase          — Input / Textarea / Label
├── CardShowcase           — Card 子组件组合
├── BadgeShowcase          — Badge 各 variant
├── SelectShowcase         — Select 下拉选择
├── CheckboxRadioShowcase  — Checkbox / RadioGroup / Switch
├── DialogShowcase         — Dialog / AlertDialog
├── TableShowcase          — Table 基础表格
├── TabsShowcase           — Tabs 受控展示
├── AdvancedShowcase       — Accordion / Avatar / Progress / Slider / Toggle / Collapsible / Tooltip / Skeleton
└── ExceptionShowcase      — ExceptionState（403 / 404 / 500 / error）
```

### 7.3 各展示分区内容

#### ThemeShowcase

- **模式切换器**：使用现有 `ThemeModeSwitch` 组件，切换 light/dark/system
- **主题名切换器**：使用 Select 组件，切换 default/compact

#### ButtonShowcase

- 变体展示：default / secondary / destructive / outline / ghost / link
- 尺寸展示：sm / default / lg / icon
- 禁用态展示

#### InputShowcase

- Input 各状态（默认 / 禁用）
- Textarea
- Label 配合使用

#### CardShowcase

- Card + CardHeader / CardTitle / CardDescription / CardContent / CardFooter 组合
- Card 内嵌 Switch 示例

#### BadgeShowcase

- Badge 各 variant：default / secondary / destructive / outline

#### SelectShowcase

- Select 下拉选择受控用法

#### CheckboxRadioShowcase

- Checkbox 受控 / 非受控
- RadioGroup 选项组
- Switch 开关

#### DialogShowcase

- Dialog 触发 / 内容 / 关闭
- AlertDialog 确认操作

#### TableShowcase

- Table 基础数据表格（含 Badge 状态列）

#### TabsShowcase

- Tabs 受控 / 非受控
- TabsContent 内嵌 Card + Input 表单

#### AdvancedShowcase

- Accordion 折叠面板
- Avatar 头像
- Progress 进度条
- Slider 滑块
- Toggle / ToggleGroup 切换
- Collapsible 折叠
- Tooltip 提示
- Skeleton 加载占位

#### ExceptionShowcase

- ExceptionState 各 variant：403 / 404 / 500 / error
- 各 variant 的标题、描述、操作按钮配置

### 7.4 辅助组件

**ShowcaseSection**：分区容器，直接在 `ComponentShowcaseView.tsx` 中定义为内联组件，不基于 DataPanel。

```tsx
interface ShowcaseSectionProps {
  title: string
  description?: string
  children: ReactNode
}
```

> **说明**：`ComponentRow` 和 `CodeBlock` 辅助组件在当前实现中未使用。每个展示分区只包含实时渲染的组件，不含代码片段展示。如后续需补充用法文档，可添加 CodeBlock 组件。
> code: string // 源代码字符串
> language?: string // 语法高亮语言，默认 'tsx'
> }

```

### 7.5 主题切换增强

`apps/react-app/src/stores/theme.ts` 已实现完整的主题切换 store（基于 Zustand）：

- `themeName: ThemeName` 状态，默认 `'default'`
- `setThemeName(name: ThemeName)` action，调用 `applyThemeToDocument()` 重新注入 CSS 变量
- `preference: ThemePreference` 状态（`'light'` / `'dark'` / `'system'`）
- `setPreference(preference)` action，自动解析 mode 并同步 `localStorage`
- `mode: ThemeMode` 派生状态（由 preference + 系统偏好解析得到）
- `startSystemSync()` / `stopSystemSync()` 系统主题变化订阅

展示页面通过 `ThemeModeSwitch` + Select 切换器实时观察所有组件在 default/compact 主题和 light/dark 模式下的视觉差异。

---

## 8. 正式契约

### 8.1 设计令牌契约

- 新增 token 模块遵循现有 `as const` + `to-css.ts` 生成模式
- `transitions.ts` 从 `motion.ts` 派生，禁止独立定义 duration/easing 值
- 颜色系统新增字段中，**静态不变的**（如 `primaryScale`、`secondary` 系列色值）作为静态 token 输出；**light/dark 模式下值不同的**（如交互态颜色 `colorBgHover`/`colorBgPressed` 等）必须纳入 ThemeSnapshot 作为运行时可切换字段
- ThemeSnapshot 新增字段均为**运行时可切换**（通过 `--theme-*` CSS 变量注入）
- 暗色主题通过 `deriveDarkFromLight()` 派生，禁止手动维护暗色快照；派生函数使用直接映射而非运行时叠印算法；交互态颜色叠加方向反转（`rgba(0,0,0,*)` → `rgba(255,255,255,*)`）；destructive 系列保持与 light 一致不提亮
- 桥接变量 (`--background`, `--primary` 等) 始终通过 `var(--theme-*)` 引用运行时变量，禁止引用 `var(--color-*)` 静态 token 或重复声明值
- `error` 用于状态展示，`destructive` 用于危险操作，两者同属红色系但语义不同

### 8.2 组件库契约

- 所有新组件必须使用 shadcn/ui 模式（React 19 `ref` prop + `cva` + `cn()`）
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

- 展示页路由 `/components` 位于 `apps/react-app/src/router/index.tsx`，路径为 `/components`
- 展示页组件放入 `apps/react-app/src/views/showcase/ComponentShowcaseView.tsx`
- 展示页不引入额外生产依赖
- 不纳入生产部署的正式菜单体系，仅作为开发辅助页面通过 URL 直接访问

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
```
