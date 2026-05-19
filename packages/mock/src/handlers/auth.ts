// ============================================================================
// @repo/mock — 认证 Handler
// ============================================================================
// POST /api/auth/login     — 登录，按用户名选择人设
// POST /api/auth/logout    — 登出，重置人设
// GET  /api/account/profile — 返回当前用户信息
// ============================================================================
import { http } from 'msw'
import { success, jsonResponse } from '../helpers'
import {
  setPersona,
  resetPersona,
  getPersona,
  resolvePersonaFromRequest,
  type PersonaKey,
} from '../personas'

const usernameMap: Record<string, PersonaKey> = {
  'super-admin': 'super-admin',
  superadmin: 'super-admin',
  operator: 'operator',
  auditor: 'auditor',
  guest: 'guest',
}

export const authHandlers = [
  http.post(/\/api\/auth\/login$/, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string }
    const username = body?.username ?? ''
    const personaKey = usernameMap[username.toLowerCase()] ?? 'guest'

    setPersona(personaKey)
    const persona = getPersona()

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
    resetPersona()
    return jsonResponse(success(null))
  }),

  http.get(/\/api\/account\/profile$/, ({ request }) => {
    const persona = resolvePersonaFromRequest(request)
    return jsonResponse(
      success({
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
      }),
    )
  }),

  http.put(/\/api\/account\/profile$/, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const persona = resolvePersonaFromRequest(request)

    persona.displayName = (body.displayName as string) ?? persona.name
    persona.email = (body.email as string) ?? persona.email
    persona.phone = (body.phone as string) ?? persona.phone
    persona.department = (body.department as string) ?? persona.department
    persona.locale = (body.locale as 'zh-CN' | 'en-US') ?? persona.locale
    persona.themePreference =
      (body.themePreference as 'system' | 'light' | 'dark') ?? persona.themePreference

    return jsonResponse(
      success({
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
      }),
    )
  }),
]
