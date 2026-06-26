import type { HTMLAttributes } from 'react'
import type { StatusTone } from '@repo/shared-types/ui-contract'

interface StatusTagProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusTone
  label: string
}

export function StatusTag({ status, label, className, ...rest }: StatusTagProps) {
  return (
    <span
      {...rest}
      className={['repo-status-tag', className].filter(Boolean).join(' ')}
      data-status={status}
    >
      {label}
    </span>
  )
}
