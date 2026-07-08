import type { HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  variant?: 'default' | 'compact'
  actionText?: string
  onAction?: () => void
}

export function EmptyState({
  title,
  description,
  variant,
  actionText,
  onAction,
  className,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'grid gap-3 place-items-center py-8 px-4 text-center text-muted-foreground',
        variant === 'compact' && 'py-4 px-0',
        className,
      )}
      {...rest}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="text-sm">{description}</p> : null}
      {actionText ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  )
}
