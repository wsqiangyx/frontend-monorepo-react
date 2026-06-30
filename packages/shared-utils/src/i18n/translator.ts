// ============================================================================
// @repo/shared-utils/i18n — 翻译器工厂
// ============================================================================
// 创建轻量级翻译器实例，不依赖 react-i18next。
//
// 翻译逻辑：
//   1. 优先从当前 locale 的消息表查找 key
//   2. 未找到则回退到 fallbackLocale（默认 en-US）
//   3. 仍未找到则返回 key 本身（避免 undefined）
//
// 此翻译器供非 React 场景使用（如纯工具函数中的文案）。
// React 组件应使用 react-i18next 的 useTranslation hook。
// ============================================================================

import { FALLBACK_LOCALE } from './constants'
import type { Locale, Messages, Translator } from './types'

export function createTranslator(options: {
  locale: Locale
  fallbackLocale?: Locale
  messages: Messages
}): Translator {
  const fallbackLocale = options.fallbackLocale ?? FALLBACK_LOCALE

  return {
    locale: options.locale,
    fallbackLocale,
    t(key) {
      return options.messages[options.locale][key] ?? options.messages[fallbackLocale][key] ?? key
    },
  }
}
