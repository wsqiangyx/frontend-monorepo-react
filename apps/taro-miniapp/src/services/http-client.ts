import { createTaroHttpClient } from '@repo/cross-platform-utils/http'
import type { TaroHttpClientConfig } from '@repo/cross-platform-utils/http'
import Taro from '@tarojs/taro'

let _getToken: () => string | null = () => null
export function registerTokenProvider(provider: () => string | null): void {
  _getToken = provider
}

const baseConfig: TaroHttpClientConfig = {
  baseURL: '/api',
  getToken: () => _getToken(),
}

export const api = createTaroHttpClient(baseConfig, Taro)
