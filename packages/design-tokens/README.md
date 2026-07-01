# @repo/design-tokens

设计令牌：平台无关的颜色、间距、字号、圆角、阴影等设计变量。

## 职责

- CSS 自定义属性（`tokens.css`）
- Tailwind CSS 主题预设（`tailwind-preset`）
- 主题运行时类型与工具（`theme`）
- 响应式断点定义

## 约束

- 仅依赖 `@repo/shared-utils`（消费 `ThemeName`、`ThemeMode` 等类型）
- 不承载业务状态或私有主题逻辑

## 导出

```typescript
import '@repo/design-tokens/css'
import { tailwindPreset } from '@repo/design-tokens/tailwind-preset'
import { applyThemeToDocument } from '@repo/design-tokens/theme'
```

## 命令

```bash
pnpm -F @repo/design-tokens test
pnpm -F @repo/design-tokens typecheck
pnpm -F @repo/design-tokens build
```
