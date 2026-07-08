import type { HTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface BreadcrumbItem {
  title: string
  path?: string
}

interface AppBreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

export function AppBreadcrumb({ items, className, ...rest }: AppBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-muted-foreground', className)}
      {...rest}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={item.path ?? index} className="flex items-center">
            {isLast ? (
              <span className="font-medium text-foreground">{item.title}</span>
            ) : (
              <>
                <span>{item.title}</span>
                <span className="mx-2">/</span>
              </>
            )}
          </span>
        )
      })}
    </nav>
  )
}
