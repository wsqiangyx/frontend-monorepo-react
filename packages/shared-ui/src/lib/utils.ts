// ============================================================================
// @repo/shared-ui — cn() utility for Tailwind CSS class merging
// ============================================================================
// Combines clsx (conditional class names) with tailwind-merge (deduplication)
// to safely merge Tailwind CSS classes without conflicts.
//
// Usage:
//   cn('px-4 py-2', isActive && 'bg-primary', className)
// ============================================================================
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
