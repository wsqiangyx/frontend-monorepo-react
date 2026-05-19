import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { applyThemeToDocument } from '@repo/design-tokens/theme'
import App from '@/App'
import '@/styles/global.scss'

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'
import '@repo/shared-ui/style.css'

export function bootstrap() {
  applyThemeToDocument({
    themeName: 'default',
    preference: 'system',
    resolvedMode: 'light',
  })

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
}
