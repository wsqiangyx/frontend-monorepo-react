import type { HTMLAttributes, ReactNode } from 'react'

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  breadcrumb?: ReactNode
  extra?: ReactNode
  children: ReactNode
}

export function PageContainer({
  title,
  breadcrumb,
  extra,
  children,
  className,
  ...rest
}: PageContainerProps) {
  return (
    <div className={['repo-page-container', className].filter(Boolean).join(' ')} {...rest}>
      {title || breadcrumb || extra ? (
        <div className="repo-page-container-header">
          <div className="repo-page-container-header-left">
            {breadcrumb}
            {title ? <h2 className="repo-page-container-title">{title}</h2> : null}
          </div>
          {extra ? <div className="repo-page-container-header-right">{extra}</div> : null}
        </div>
      ) : null}
      <div className="repo-page-container-body">{children}</div>
    </div>
  )
}
