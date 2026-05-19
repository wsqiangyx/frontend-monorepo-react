import type { HTMLAttributes, ReactNode } from 'react'
import type { WorkspaceTab } from '@repo/platform-core'

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
    <div className={['repo-tab-workspace', className].filter(Boolean).join(' ')} {...rest}>
      <div className="repo-tab-workspace-bar" role="tablist">
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey

          return (
            <div
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              className={['repo-tab-workspace-tab', isActive ? 'repo-tab-workspace-tab-active' : '']
                .filter(Boolean)
                .join(' ')}
            >
              <button
                type="button"
                className="repo-tab-workspace-tab-title"
                onClick={() => onTabClick?.(tab)}
              >
                {tab.title}
              </button>
              {tab.closable && onTabClose ? (
                <button
                  type="button"
                  className="repo-tab-workspace-tab-close"
                  aria-label={`Close ${tab.title}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onTabClose(tab)
                  }}
                >
                  x
                </button>
              ) : null}
            </div>
          )
        })}
      </div>
      <div className="repo-tab-workspace-content">{children}</div>
    </div>
  )
}
