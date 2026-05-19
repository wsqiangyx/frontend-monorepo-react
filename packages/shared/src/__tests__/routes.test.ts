import { describe, expect, it } from 'vitest'
import { routeDefinitions } from '../routes'
import { createReactRoutes } from '../routes/react-adapter'

describe('createReactRoutes', () => {
  it('should convert definitions to react-router config', () => {
    const mockElement = { type: 'div' } as React.ReactElement
    const viewResolver = () => mockElement

    const routes = createReactRoutes(routeDefinitions, viewResolver)
    expect(routes.length).toBe(routeDefinitions.length)
    expect(routes[0].path).toBe('/')
    expect(routes[0].id).toBe('home')
    expect(routes[0].element).toBe(mockElement)
  })
})

describe('routeDefinitions', () => {
  it('should have at least one route', () => {
    expect(routeDefinitions.length).toBeGreaterThan(0)
  })

  it('should have home route', () => {
    const home = routeDefinitions.find((route) => route.name === 'home')
    expect(home).toBeDefined()
    expect(home?.path).toBe('/')
  })
})
