import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

interface DataPanelProps extends HTMLAttributes<HTMLElement> {
  title?: string
  description?: string
  loading?: boolean
  loadingText?: string
  empty?: boolean
  bordered?: boolean
  toolbar?: ReactNode
  children?: ReactNode
  emptyContent?: ReactNode
}

export function DataPanel({
  title,
  description,
  loading,
  loadingText,
  empty,
  bordered = true,
  toolbar,
  children,
  emptyContent,
  className,
  ...rest
}: DataPanelProps) {
  return (
    <section
      className={cn(
        'rounded-lg border bg-card p-6 shadow-sm',
        bordered ? '' : 'border-0 shadow-none',
        className,
      )}
      {...rest}
    >
      {title || description || toolbar ? (
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            {title ? <h2 className="text-lg font-semibold">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            ) : null}
          </div>
          {toolbar}
        </div>
      ) : null}
      {loading ? <div aria-busy="true">{loadingText}</div> : empty ? emptyContent : children}
    </section>
  )
}
