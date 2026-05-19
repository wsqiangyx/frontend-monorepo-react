import { describe, expect, it } from 'vitest'
import * as routeExports from '../routes'
import * as reactRouteExports from '../routes/react-adapter'

describe('@repo/shared routes public contract', () => {
  it('keeps the base routes entry focused on framework-agnostic definitions', () => {
    expect(routeExports).toHaveProperty('routeDefinitions')
    expect(routeExports).not.toHaveProperty('createReactRoutes')
  })

  it('exposes the react adapter on an explicit subpath', () => {
    expect(reactRouteExports).toHaveProperty('createReactRoutes')
  })
})
