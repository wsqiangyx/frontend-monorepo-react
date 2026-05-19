import type { HTMLAttributes, ReactNode } from 'react'

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
      className={[
        'repo-filter-bar',
        align === 'start' ? 'repo-filter-bar-start' : '',
        wrap ? '' : 'repo-filter-bar-no-wrap',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      <div className="repo-filter-bar-content">{children}</div>
      {actions}
    </div>
  )
}
