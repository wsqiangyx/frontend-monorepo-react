import type { HTMLAttributes, ReactNode } from 'react'

type ExceptionVariant = '403' | '404' | '500' | 'error'

interface ExceptionStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ExceptionVariant
  title?: string
  description?: string
  action?: ReactNode
}

const defaultTitles: Record<ExceptionVariant, string> = {
  '403': '403',
  '404': '404',
  '500': '500',
  error: 'Error',
}

export function ExceptionState({
  variant = 'error',
  title,
  description,
  action,
  className,
  ...rest
}: ExceptionStateProps) {
  return (
    <div className={['repo-exception-state', className].filter(Boolean).join(' ')} {...rest}>
      <div className="repo-exception-state-code">{title ?? defaultTitles[variant]}</div>
      {description ? <p className="repo-exception-state-desc">{description}</p> : null}
      {action ? <div className="repo-exception-state-action">{action}</div> : null}
    </div>
  )
}
