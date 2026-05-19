// ============================================================================
// 应用装配入口（Composition Root）
// ============================================================================
// 职责：将所有共享层模块组装为可运行的 React 应用。
//
// 执行顺序：
//   1. 从 themeStore 读取当前主题状态
//   2. 调用 applyThemeToDocument 将 CSS 变量注入 <style>
//   3. 加载 UnoCSS reset、UnoCSS 原子类、shared-ui 全局样式
//   4. 通过 StrictMode + createRoot 挂载 React 应用
//
// 注意：此文件不包含业务逻辑，仅负责依赖装配与全局初始化。
// ============================================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { applyThemeToDocument } from '@repo/design-tokens/theme'
import App from '@/App'
import '@/styles/global.scss'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@repo/shared-ui/style.css'
import { useThemeStore } from '@/stores/theme'

export function bootstrap() {
  const themeState = useThemeStore.getState()

  applyThemeToDocument({
    themeName: themeState.themeName,
    preference: themeState.preference,
    resolvedMode: themeState.mode,
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
