import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@repo/shared-ui'
import { I18nProvider } from '@/i18n'
import { router } from '@/router'
import { useThemeStore } from '@/stores/theme'

function App() {
  const themeName = useThemeStore((state) => state.themeName)
  const preference = useThemeStore((state) => state.preference)
  const mode = useThemeStore((state) => state.mode)
  const startSystemSync = useThemeStore((state) => state.startSystemSync)
  const stopSystemSync = useThemeStore((state) => state.stopSystemSync)

  useEffect(() => {
    startSystemSync()

    return () => {
      stopSystemSync()
    }
  }, [startSystemSync, stopSystemSync])

  return (
    <ThemeProvider themeName={themeName} preference={preference} mode={mode}>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
