import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { ThemeProvider } from '@repo/shared-ui'
import { I18nProvider } from '@/i18n'
import { router } from '@/router'
import { useThemeStore } from '@/stores/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 分钟内不重新请求
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

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
      <QueryClientProvider client={queryClient}>
        <I18nProvider>
          <RouterProvider router={router} />
        </I18nProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
