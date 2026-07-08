import type { HTMLAttributes, ReactNode } from 'react'
import type { WorkspaceTab } from '@repo/shared-service'
import { cn } from '../lib/utils'

interface TabWorkspaceProps extends HTMLAttributes<HTMLDivElement> {
  tabs: WorkspaceTab[]
  activeKey: string
  onTabClick?: (tab: WorkspaceTab) => void
  onTabClose?: (tab: WorkspaceTab) => void
  children: ReactNode
}

export function TabWorkspace({
  tabs,
  activeKey,
  onTabClick,
  onTabClose,
  children,
  className,
  ...rest
}: TabWorkspaceProps) {
  return (
    <div className={cn('flex flex-col h-full', className)} {...rest}>
      <div className="flex items-center border-b bg-background overflow-x-auto" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey

          return (
            <div
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={cn(
                'flex items-center gap-2 px-4 py-2 text-sm border-b-2 transition-colors',
                isActive
                  ? 'border-primary text-foreground bg-background'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50',
              )}
            >
              <button type="button" className="flex-1 text-left" onClick={() => onTabClick?.(tab)}>
                {tab.title}
              </button>
              {tab.closable && onTabClose ? (
                <button
                  type="button"
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                  aria-label={`Close ${tab.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose(tab)
                  }}
                >
                  ×
                </button>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
