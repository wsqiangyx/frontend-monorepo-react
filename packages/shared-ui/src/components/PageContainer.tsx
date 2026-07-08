import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../lib/utils'

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
    <div className={cn('p-4', className)} {...rest}>
      {title || breadcrumb || extra ? (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex flex-col gap-1">
            {breadcrumb}
            {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
          </div>
          {extra ? <div>{extra}</div> : null}
        </div>
      ) : null}
      <div className="min-h-0">{children}</div>
    </div>
  )
}
