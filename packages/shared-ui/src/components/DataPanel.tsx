import type { HTMLAttributes, ReactNode } from 'react'

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
      className={['repo-data-panel', bordered ? '' : 'repo-data-panel-borderless', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {title || description || toolbar ? (
        <div className="repo-data-panel-header">
          <div>
            {title ? <h2>{title}</h2> : null}
            {description ? <p className="repo-data-panel-description">{description}</p> : null}
          </div>
          {toolbar}
        </div>
      ) : null}
      {loading ? <div aria-busy="true">{loadingText}</div> : empty ? emptyContent : children}
    </section>
  )
}
