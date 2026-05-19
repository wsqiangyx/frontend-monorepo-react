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
