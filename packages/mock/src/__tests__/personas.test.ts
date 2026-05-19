import { afterEach, describe, expect, it } from 'vitest'
import {
  personas,
  getPersona,
  setPersona,
  resetPersona,
  resolvePersonaKeyFromToken,
  resolvePersonaFromRequest,
  type PersonaKey,
} from '../personas'

describe('persona definitions', () => {
  const keys: PersonaKey[] = ['super-admin', 'operator', 'auditor', 'guest']

  it('all personas have required fields', () => {
    for (const key of keys) {
      const p = personas[key]
      expect(p.id).toBeTruthy()
      expect(p.name).toBeTruthy()
      expect(p.email).toContain('@')
      expect(p.role).toBe(key)
      expect(Array.isArray(p.permissions)).toBe(true)
      expect(p.permissions.length).toBeGreaterThan(0)
      expect(Array.isArray(p.menus)).toBe(true)
      expect(p.menus.length).toBeGreaterThan(0)
      expect(p.dashboardSummary).toBeDefined()
    }
  })

  it('super-admin has the most permissions', () => {
    const admin = personas['super-admin']
    const guest = personas['guest']
    expect(admin.permissions.length).toBeGreaterThan(guest.permissions.length)
  })

  it('super-admin sees all top-level menu sections', () => {
    const admin = personas['super-admin']
    const keys = admin.menus.map((m) => m.key)
    expect(keys).toContain('dashboard')
    expect(keys).toContain('user-center')
    expect(keys).toContain('system')
  })

  it('guest sees dashboard and profile', () => {
    const guest = personas['guest']
    expect(guest.menus).toHaveLength(2)
    expect(guest.menus[0].key).toBe('dashboard')
    expect(guest.menus[1].key).toBe('profile')
  })

  it('each persona has different dashboard summaries', () => {
    const summaries = keys.map((k) => JSON.stringify(personas[k].dashboardSummary))
    const unique = new Set(summaries)
    expect(unique.size).toBe(keys.length)
  })

  it('menu nodes use title instead of label', () => {
    for (const key of keys) {
      for (const menu of personas[key].menus) {
        expect(menu.title).toBeTruthy()
      }
    }
  })

  it('menu nodes include type, order, and routeName for routes', () => {
    const dashboard = personas['super-admin'].menus.find((m) => m.key === 'dashboard')
    expect(dashboard?.type).toBe('route')
    expect(dashboard?.order).toBeTypeOf('number')
    expect(dashboard?.routeName).toBe('Dashboard')
  })

  it('permission codes follow system:domain:action pattern', () => {
    const admin = personas['super-admin']
    for (const code of admin.permissions) {
      const parts = code.split(':')
      expect(parts.length).toBeGreaterThanOrEqual(3)
      expect(parts[0]).toBe('system')
    }
  })
})

describe('persona selection', () => {
  afterEach(() => {
    resetPersona()
  })

  it('default persona is operator', () => {
    expect(getPersona().role).toBe('operator')
  })

  it('setPersona switches the active persona', () => {
    setPersona('auditor')
    expect(getPersona().role).toBe('auditor')
    expect(getPersona().name).toBe('审计员')
  })

  it('resetPersona restores operator default', () => {
    setPersona('super-admin')
    expect(getPersona().role).toBe('super-admin')
    resetPersona()
    expect(getPersona().role).toBe('operator')
  })
})

describe('resolvePersonaKeyFromToken', () => {
  it('returns operator for null authorization', () => {
    expect(resolvePersonaKeyFromToken(null)).toBe('operator')
  })

  it('returns operator for invalid token format', () => {
    expect(resolvePersonaKeyFromToken('Bearer invalid-token')).toBe('operator')
    expect(resolvePersonaKeyFromToken('Basic dXNlcjpwYXNz')).toBe('operator')
  })

  it('parses valid mock token', () => {
    expect(resolvePersonaKeyFromToken('Bearer mock-token-super-admin')).toBe('super-admin')
    expect(resolvePersonaKeyFromToken('Bearer mock-token-operator')).toBe('operator')
    expect(resolvePersonaKeyFromToken('Bearer mock-token-auditor')).toBe('auditor')
    expect(resolvePersonaKeyFromToken('Bearer mock-token-guest')).toBe('guest')
  })

  it('is case-insensitive for Bearer prefix', () => {
    expect(resolvePersonaKeyFromToken('bearer mock-token-super-admin')).toBe('super-admin')
    expect(resolvePersonaKeyFromToken('BEARER mock-token-operator')).toBe('operator')
  })

  it('returns operator for unknown persona key in token', () => {
    expect(resolvePersonaKeyFromToken('Bearer mock-token-unknown')).toBe('operator')
  })
})

describe('resolvePersonaFromRequest', () => {
  it('returns operator persona for request without Authorization header', () => {
    const request = { headers: { get: () => null } }
    const persona = resolvePersonaFromRequest(request)
    expect(persona.role).toBe('operator')
  })

  it('returns correct persona for valid Authorization header', () => {
    const request = {
      headers: {
        get: (name: string) => (name === 'Authorization' ? 'Bearer mock-token-auditor' : null),
      },
    }
    const persona = resolvePersonaFromRequest(request)
    expect(persona.role).toBe('auditor')
    expect(persona.name).toBe('审计员')
  })
})
