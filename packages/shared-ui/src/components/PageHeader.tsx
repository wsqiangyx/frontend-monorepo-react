import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  actions?: ReactNode
  extra?: ReactNode
}

export function PageHeader({
  title,
  subtitle,
  actions,
  extra,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-6', className)} {...rest}>
      <div className="grid gap-1">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle ? <p className="text-muted-foreground">{subtitle}</p> : null}
        {extra}
      </div>
      {actions}
    </div>
  )
}
