// ============================================================================
// 应用装配入口（Composition Root）
// ============================================================================
// 职责：将所有共享层模块组装为可运行的 React 应用。
//
// 执行顺序：
//   1. 从 themeStore 读取当前主题状态
//   2. 调用 applyThemeToDocument 将 CSS 变量注入 <style>
//   3. 加载 Tailwind CSS 基础层、shared-ui 全局样式
//   4. 创建 TanStack Query QueryClient 实例
//   5. 通过 StrictMode + createRoot 挂载 React 应用
//
// 注意：此文件不包含业务逻辑，仅负责依赖装配与全局初始化。
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { applyThemeToDocument } from '@repo/design-tokens/theme'
import { createQueryClient } from '@/lib/query-client'
import App from '@/App'
import '@/styles/tailwind.css'
import '@/styles/global.scss'
import '@repo/shared-ui/style.css'
import { useThemeStore } from '@/stores/theme'

const queryClient = createQueryClient()

export function bootstrap() {
  const themeState = useThemeStore.getState()

  applyThemeToDocument({
    themeName: themeState.themeName,
    preference: themeState.preference,
    resolvedMode: themeState.mode,
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  )
}
