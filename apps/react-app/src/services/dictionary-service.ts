import { api } from './shared'
import type { PaginatedResult } from './shared'

export interface DictionaryTypeRecord {
  type: string
  name: string
}

export interface DictionaryItemRecord {
  label: string
  value: string
}

export async function fetchDictionaryTypes() {
  return api.get<PaginatedResult<DictionaryTypeRecord>>('/system/dictionaries')
}

export async function fetchDictionaryItems(type: string) {
  return api.get<DictionaryItemRecord[]>(`/system/dictionaries/${type}`)
}
