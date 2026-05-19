import type { HTMLAttributes } from 'react'

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
      className={['repo-breadcrumb', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <span key={item.path ?? index} className="repo-breadcrumb-item">
            {isLast ? (
              <span className="repo-breadcrumb-current">{item.title}</span>
            ) : (
              <>
                <span>{item.title}</span>
                <span className="repo-breadcrumb-sep">/</span>
              </>
            )}
          </span>
        )
      })}
    </nav>
  )
}
