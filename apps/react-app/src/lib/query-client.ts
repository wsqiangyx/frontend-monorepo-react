import { QueryClient } from '@tanstack/react-query'

export interface QueryClientFactoryOptions {
  staleTime?: number
  retry?: number
  refetchOnWindowFocus?: boolean
}

/**
 * 创建应用默认的 QueryClient 实例。
 * 用于 bootstrap.tsx 与测试工具，避免配置重复散落。
 */
export function createQueryClient(options: QueryClientFactoryOptions = {}): QueryClient {
  const { staleTime = 5 * 60 * 1000, retry = 1, refetchOnWindowFocus = false } = options

  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime,
        retry,
        refetchOnWindowFocus,
      },
    },
  })
}
