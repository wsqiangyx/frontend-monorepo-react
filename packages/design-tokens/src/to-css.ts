// ============================================================================
// @repo/design-tokens — CSS 变量生成
// ============================================================================
// 将嵌套的 token 对象展平为 kebab-case 的 CSS 自定义属性，
// 并生成可注入 :root 的 CSS 字符串。
//
// 数据流：
//   colors/spacing/typography/... → tokensToCssVars() → generateCssVarsString()
//                                                          ↓
//   应用 bootstrap 阶段注入 <style>:root { --color-primary: #1677ff; ... }</style>
//
// 这样应用无需依赖额外生成的 CSS 文件，CSS 变量在运行时动态注入。
// ============================================================================
import { colors } from './colors'
import { spacing } from './spacing'
import { typography } from './typography'
import { breakpoints } from './breakpoints'
import { shadows } from './shadows'
import { radius } from './radius'
import type { ThemeSnapshot } from './theme/types'

// 递归类型：token 值可以是字符串、数字或嵌套对象
type TokenValue = string | number | Readonly<{ [key: string]: TokenValue }>
type TokenRecord = Readonly<Record<string, TokenValue>>

/**
 * 将 camelCase 转换为 kebab-case。
 * CSS 自定义属性必须保持 kebab-case，方便应用启动时直接注入使用。
 *
 * 示例：
 *   primaryHover → primary-hover
 *   fontSizeSm → font-size-sm
 */
function toKebabCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // camelCase 边界插入连字符
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2') // 处理连续大写字母（如 XMLHttp → xml-http）
    .toLowerCase()
}

/**
 * 递归展平嵌套的 token 对象为单层的键值对。
 * 嵌套键通过连字符拼接，形成 CSS 变量的层级命名。
 *
 * 示例：
 *   { color: { primary: '#1677ff' } } → { 'color-primary': '#1677ff' }
 *   { font: { size: { sm: '14px' } } } → { 'font-size-sm': '14px' }
 *
 * @param obj - 嵌套的 token 对象
 * @param prefix - 当前层级的键名前缀（递归时自动拼接）
 */
function flattenTokens(obj: TokenRecord, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(obj)) {
    const normalizedKey = toKebabCase(key)
    // 拼接前缀：有前缀时用连字符连接，无前缀时直接使用当前键
    const varName = prefix ? `${prefix}-${normalizedKey}` : normalizedKey
    if (typeof value === 'object' && value !== null) {
      // 嵌套对象：递归展平，传递当前键名作为前缀
      Object.assign(result, flattenTokens(value as TokenRecord, varName))
    } else {
      // 叶子节点：直接记录键值对
      result[varName] = String(value)
    }
  }
  return result
}

/**
 * 将所有 token 模块聚合为单层 CSS 变量映射。
 *
 * 返回值示例：
 *   {
 *     'color-primary': '#1677ff',
 *     'color-primary-hover': '#4096ff',
 *     'spacing-4': '16px',
 *     'font-size-sm': '14px',
 *     ...
 *   }
 */
export function tokensToCssVars(): Record<string, string> {
  // 顶层键名会成为 CSS 变量的第一段命名空间
  const allTokens = {
    color: colors,
    spacing,
    font: typography,
    breakpoint: breakpoints,
    shadow: shadows,
    radius,
  } satisfies TokenRecord
  return flattenTokens(allTokens)
}

function themeSnapshotToCssVars(snapshot: ThemeSnapshot): Record<string, string> {
  const vars: Record<string, string> = {}

  for (const [key, value] of Object.entries(snapshot)) {
    if (key === 'name' || key === 'mode') {
      continue
    }

    vars[`theme-${toKebabCase(key)}`] = String(value)
  }

  return vars
}

/**
 * 生成完整的 :root CSS 变量声明字符串。
 *
 * app 在 bootstrap 阶段直接注入这段字符串，不依赖额外生成的 CSS 文件。
 * 注入方式：创建 <style> 标签，将此字符串写入，追加到 document.head。
 *
 * 产出示例：
 *   :root {
 *     --color-primary: #1677ff;
 *     --spacing-4: 16px;
 *     ...
 *   }
 */
export function generateCssVarsString(snapshot?: ThemeSnapshot): string {
  const vars = snapshot
    ? { ...tokensToCssVars(), ...themeSnapshotToCssVars(snapshot) }
    : tokensToCssVars()
  const lines = Object.entries(vars).map(([key, value]) => `  --${key}: ${value};`)
  return `:root {\n${lines.join('\n')}\n}`
}
