import type { HTMLAttributes, ReactNode } from 'react'
import type { ContentMaxWidth } from '@repo/shared-utils/ui-contract'
import { cn } from '../lib/utils'

interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  sidebar?: boolean
  contentMaxWidth?: ContentMaxWidth
  header?: ReactNode
  sidebarContent?: ReactNode
  children: ReactNode
}

const contentWidthClasses: Record<ContentMaxWidth, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  fluid: 'max-w-none',
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
    <div className={cn('min-h-screen text-foreground bg-background', className)} {...rest}>
      {header}
      {sidebar ? sidebarContent : null}
      <div className={cn('w-full mx-auto py-6 px-6', contentWidthClasses[contentMaxWidth])}>
        {children}
      </div>
    </div>
  )
}
