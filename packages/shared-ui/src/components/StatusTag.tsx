import type { HTMLAttributes } from 'react'
import type { StatusTone } from '@repo/shared-utils/ui-contract'
import { cn } from '../lib/utils'

interface StatusTagProps extends HTMLAttributes<HTMLSpanElement> {
  status: StatusTone
  label: string
}

const statusStyles: Record<StatusTone, string> = {
  success: 'text-success border-success',
  warning: 'text-warning border-warning',
  error: 'text-error border-error',
  info: 'text-info border-info',
  neutral: 'text-muted-foreground border-border-strong',
}

export function StatusTag({ status, label, className, ...rest }: StatusTagProps) {
  return (
    <span
      {...rest}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-elevated',
        statusStyles[status],
        className,
      )}
      data-status={status}
    >
      {label}
    </span>
  )
}
