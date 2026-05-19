import type { HTMLAttributes, ReactNode } from 'react'

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
    <div className={['repo-page-header', className].filter(Boolean).join(' ')} {...rest}>
      <div className="repo-page-header-meta">
        <h1 className="repo-page-header-title">{title}</h1>
        {subtitle ? <p className="repo-page-header-subtitle">{subtitle}</p> : null}
        {extra}
      </div>
      {actions}
    </div>
  )
}
