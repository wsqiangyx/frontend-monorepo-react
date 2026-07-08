import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

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
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-12 px-4 text-center',
        className,
      )}
      {...rest}
    >
      <div className="text-6xl font-bold text-muted-foreground">
        {title ?? defaultTitles[variant]}
      </div>
      {description ? <p className="text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}
