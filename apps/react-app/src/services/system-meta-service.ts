import { api } from './shared'

export interface SystemMetaRecord {
  version: string
  buildTime: string
  features: string[]
  environment: string
}

export async function fetchSystemMeta() {
  return api.get<SystemMetaRecord>('/system/meta')
}
