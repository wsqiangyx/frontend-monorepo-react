// ============================================================================
// @repo/design-tokens — Ant Design 主题适配器
// ============================================================================
// 将 ui-tokens 的设计令牌映射到 Ant Design 的 Design Token 格式。
// 被 react-app 的 bootstrap.tsx 通过 <ConfigProvider theme={...} /> 消费。
//
// 这里只做 Ant Design 主题适配，不承担完整主题系统职责。
// 只映射了全局 token，如需覆盖组件级 token 可在返回对象的 components 中扩展。
// ============================================================================
import { colors } from '../colors'
import { radius } from '../radius'
import { typography } from '../typography'
import type { ThemeSnapshot } from './types'

/**
 * 创建 Ant Design 的主题 token 对象。
 * 返回值直接传入 <ConfigProvider theme={createAntdTheme()} />。
 *
 * 注意：Ant Design 的 Design Token 要求数值类型（不带 px 后缀），
 * 而 ui-tokens 中 borderRadius/fontSize 等值为字符串（如 "4px"），
 * 因此需要 Number.parseInt() 去掉 px 后缀转为数字。
 */
export function createAntdTheme(snapshot?: ThemeSnapshot): Record<string, unknown> {
  const colorBrandPrimary = snapshot?.colorBrandPrimary ?? colors.primary
  const colorSuccess = snapshot?.colorSuccess ?? colors.success
  const colorWarning = snapshot?.colorWarning ?? colors.warning
  const colorError = snapshot?.colorError ?? colors.error
  const colorInfo = snapshot?.colorInfo ?? colors.info
  const colorBgPage = snapshot?.colorBgPage ?? colors.bg.default
  const colorTextPrimary = snapshot?.colorTextPrimary ?? colors.text.primary
  const radiusMd = snapshot?.radiusMd ?? radius.md
  const radiusSm = snapshot?.radiusSm ?? radius.sm
  const radiusLg = snapshot?.radiusLg ?? radius.lg

  return {
    token: {
      colorPrimary: colorBrandPrimary,
      colorSuccess,
      colorWarning,
      colorError,
      colorInfo,
      colorBgBase: colorBgPage,
      colorTextBase: colorTextPrimary,
      // Ant Design 要求 borderRadius 为数字（不含 px），parseInt 自动去掉单位
      borderRadius: Number.parseInt(radiusMd), // "6px" → 6
      borderRadiusSM: Number.parseInt(radiusSm), // "2px" → 2
      borderRadiusLG: Number.parseInt(radiusLg), // "8px" → 8
      fontFamily: typography.fontFamily.base,
      // Ant Design 要求 fontSize 为数字（不含 px）
      fontSize: Number.parseInt(typography.fontSize.sm), // "14px" → 14
      controlHeight: 36,
    },
  }
}
