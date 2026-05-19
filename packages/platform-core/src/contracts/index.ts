export interface PlatformContract {
  version: string
}

export function createContract(version: string): PlatformContract {
  return { version }
}
