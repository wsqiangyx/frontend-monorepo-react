import { api } from './shared'

export interface ProfileRecord {
  id: string
  name: string
  displayName: string
  email: string
  phone: string
  role: string
  roleLabel: string
  department: string
  lastLoginAt: string
  locale: 'zh-CN' | 'en-US'
  themePreference: 'system' | 'light' | 'dark'
}

export async function fetchProfile() {
  return api.get<ProfileRecord>('/account/profile')
}

export async function updateProfile(data: Partial<ProfileRecord>) {
  return api.put<ProfileRecord>('/account/profile', data)
}
