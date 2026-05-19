import type { HTMLAttributes } from 'react'

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
      className={[
        'repo-empty-state',
        variant === 'compact' ? 'repo-empty-state-compact' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {actionText ? (
        <button type="button" onClick={onAction}>
          {actionText}
        </button>
      ) : null}
    </div>
  )
}
