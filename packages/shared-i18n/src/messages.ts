import type { Messages, Locale } from './types'

export const sharedMessages: Messages = {
  'zh-CN': {
    'common.theme': '主题',
    'common.light': '浅色',
    'common.dark': '深色',
    'common.loading': '加载中',
    'common.language': '语言',
    'common.switchLanguage': '切换语言',
    'common.fetch': '获取',
    'common.retry': '重试',
  },
  'en-US': {
    'common.theme': 'Theme',
    'common.light': 'Light',
    'common.dark': 'Dark',
    'common.loading': 'Loading',
    'common.language': 'Language',
    'common.switchLanguage': 'Switch language',
    'common.fetch': 'Fetch',
    'common.retry': 'Retry',
  },
}

const allLocales: Locale[] = ['zh-CN', 'en-US']

export function mergeMessages(...messageSets: Messages[]): Messages {
  const result: Messages = {} as Messages
  for (const locale of allLocales) {
    result[locale] = messageSets.reduce(
      (acc, set) => ({ ...acc, ...set[locale] }),
      {} as Messages[Locale],
    )
  }
  return result
}
