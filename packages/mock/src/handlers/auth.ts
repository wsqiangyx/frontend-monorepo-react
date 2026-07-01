// ============================================================================
// @repo/mock — 认证 Handler
// ============================================================================
// POST /api/auth/login     — 登录，按用户名选择人设
// POST /api/auth/logout    — 登出，重置人设
// GET  /api/account/profile — 返回当前用户信息
// ============================================================================
import { http } from 'msw'
import { success, fail, jsonResponse } from '../helpers'
import {
  personas,
  resolvePersonaFromRequest,
  resolvePersonaKeyFromToken,
  getPersonaByKey,
  applyProfileOverrides,
  type PersonaKey,
  type Persona,
} from '../personas'

const usernameMap: Record<string, PersonaKey> = {
  'super-admin': 'super-admin',
  superadmin: 'super-admin',
  operator: 'operator',
  auditor: 'auditor',
  guest: 'guest',
}

const VALID_LOCALES: Persona['locale'][] = ['zh-CN', 'en-US']
const VALID_THEME_PREFERENCES: Persona['themePreference'][] = ['system', 'light', 'dark']

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string'
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

interface ProfileUpdateInput {
  displayName?: string
  email?: string
  phone?: string
  department?: string
  locale?: Persona['locale']
  themePreference?: Persona['themePreference']
}

/**
 * 校验并规范化 profile 更新字段。
 * 校验失败时抛出包含错误详情的 Error。
 */
function validateProfileUpdate(body: Record<string, unknown>): ProfileUpdateInput {
  const input: ProfileUpdateInput = {}

  if ('displayName' in body) {
    const value = body.displayName
    if (!isNonEmptyString(value) || value.length > 100) {
      throw new Error('displayName must be a non-empty string with max 100 characters')
    }
    input.displayName = value
  }

  if ('email' in body) {
    const value = body.email
    if (!isNonEmptyString(value) || !isValidEmail(value)) {
      throw new Error('email must be a valid email address')
    }
    input.email = value
  }

  if ('phone' in body) {
    const value = body.phone
    if (!isOptionalString(value)) {
      throw new Error('phone must be a string')
    }
    input.phone = value
  }

  if ('department' in body) {
    const value = body.department
    if (!isOptionalString(value)) {
      throw new Error('department must be a string')
    }
    input.department = value
  }

  if ('locale' in body) {
    const value = body.locale
    if (!VALID_LOCALES.includes(value as Persona['locale'])) {
      throw new Error(`locale must be one of ${VALID_LOCALES.join(', ')}`)
    }
    input.locale = value as Persona['locale']
  }

  if ('themePreference' in body) {
    const value = body.themePreference
    if (!VALID_THEME_PREFERENCES.includes(value as Persona['themePreference'])) {
      throw new Error(`themePreference must be one of ${VALID_THEME_PREFERENCES.join(', ')}`)
    }
    input.themePreference = value as Persona['themePreference']
  }

  return input
}

function buildProfileResponse(persona: Persona) {
  return {
    id: persona.id,
    name: persona.name,
    displayName: persona.displayName,
    email: persona.email,
    phone: persona.phone,
    role: persona.role,
    roleLabel: persona.roleLabel,
    department: persona.department,
    lastLoginAt: persona.lastLoginAt,
    locale: persona.locale,
    themePreference: persona.themePreference,
  }
}

export const authHandlers = [
  http.post(/\/api\/auth\/login$/, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    const username = body?.username ?? ''
    const personaKey = usernameMap[username.toLowerCase()] ?? 'guest'
    const persona = personas[personaKey]

    return jsonResponse(
      success({
        token: `mock-token-${personaKey}`,
        userId: persona.id,
        role: persona.role,
        persona: personaKey,
      }),
    )
  }),

  http.post(/\/api\/auth\/logout$/, () => {
    return jsonResponse(success(null))
  }),

  http.get(/\/api\/account\/profile$/, ({ request }) => {
    const persona = resolvePersonaFromRequest(request)
    return jsonResponse(success(buildProfileResponse(persona)))
  }),

  http.put(/\/api\/account\/profile$/, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const authorization = request.headers.get('Authorization')
    const personaKey = resolvePersonaKeyFromToken(authorization)

    try {
      const input = validateProfileUpdate(body)
      const basePersona = getPersonaByKey(personaKey)
      applyProfileOverrides(personaKey, input)
      const updatedPersona = { ...basePersona, ...input }
      return jsonResponse(success(buildProfileResponse(updatedPersona)))
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Invalid profile update'
      return jsonResponse(fail('VALIDATION_ERROR', message), 400)
    }
  }),
]
