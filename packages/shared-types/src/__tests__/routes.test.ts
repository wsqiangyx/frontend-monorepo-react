import { describe, it, expect } from 'vitest'
import { routeDefinitions } from '../routes/index.js'

describe('@repo/shared-types/routes', () => {
  it('should export routeDefinitions', () => {
    expect(routeDefinitions).toBeDefined()
    expect(Array.isArray(routeDefinitions)).toBe(true)
    expect(routeDefinitions.length).toBeGreaterThan(0)
  })

  it('should have home route', () => {
    const homeRoute = routeDefinitions.find((r) => r.name === 'home')
    expect(homeRoute).toBeDefined()
    expect(homeRoute?.path).toBe('/')
    expect(homeRoute?.meta?.title).toBe('首页')
  })
})
