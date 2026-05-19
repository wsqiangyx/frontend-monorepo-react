import '@testing-library/jest-dom/vitest'

const originalConsoleError = console.error

console.error = (...args: unknown[]) => {
  if (typeof args[0] === 'string' && args[0].includes('Could not parse CSS stylesheet')) {
    return
  }

  originalConsoleError(...args)
}
