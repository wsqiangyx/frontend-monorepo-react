import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

interface FilterBarProps extends HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'between'
  wrap?: boolean
  children: ReactNode
  actions?: ReactNode
}

export function FilterBar({
  align = 'between',
  wrap = true,
  children,
  actions,
  className,
  ...rest
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-4 mb-4',
        align === 'start' ? 'justify-start' : 'justify-between',
        !wrap && 'flex-nowrap',
        className,
      )}
      {...rest}
    >
      <div className={cn('flex flex-wrap gap-3', !wrap && 'flex-nowrap')}>{children}</div>
      {actions}
    </div>
  )
}
