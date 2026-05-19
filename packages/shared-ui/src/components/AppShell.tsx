import type { HTMLAttributes, ReactNode } from 'react'
import type { ContentMaxWidth } from '@repo/shared/ui-contract'

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: boolean
  contentMaxWidth?: ContentMaxWidth
  header?: ReactNode
  sidebarContent?: ReactNode
  children: ReactNode
}

export function AppShell({
  sidebar,
  contentMaxWidth = 'xl',
  header,
  sidebarContent,
  children,
  className,
  ...rest
}: AppShellProps) {
  return (
    <div className={['repo-app-shell', className].filter(Boolean).join(' ')} {...rest}>
      {header}
      {sidebar ? sidebarContent : null}
      <div
        className={`repo-app-shell-content ${
          contentMaxWidth === 'fluid' ? 'repo-app-shell-content-fluid' : ''
        }`}
      >
        {children}
      </div>
    </div>
  )
}
