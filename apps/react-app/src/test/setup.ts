import '@testing-library/jest-dom/vitest'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import { server } from '@repo/mock/server'

const originalConsoleError = console.error

console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Could not parse CSS stylesheet')) {
    return
  }

  originalConsoleError(...args)
}

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
