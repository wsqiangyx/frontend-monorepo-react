import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { createQueryClient } from '@/lib/query-client'

function createTestQueryClient() {
  return createQueryClient({
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function renderWithProviders(ui: ReactElement) {
  const queryClient = createTestQueryClient()

  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }

  return render(ui, { wrapper: Wrapper })
}
