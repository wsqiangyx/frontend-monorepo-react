import type { HTMLAttributes, ReactNode } from 'react'
import type { PlatformMenuNode } from '@repo/shared-service'
import { cn } from '../lib/utils'

interface SideMenuProps extends Omit<HTMLAttributes<HTMLElement>, 'onSelect'> {
  nodes: PlatformMenuNode[]
  activeKey?: string
  onSelect?: (node: PlatformMenuNode) => void
  footer?: ReactNode
}

export function SideMenu({
  nodes,
  activeKey,
  onSelect,
  footer,
  className,
  ...rest
}: SideMenuProps) {
  function renderNode(node: PlatformMenuNode) {
    if (node.hidden) return null

    const isActive = node.key === activeKey
    const hasChildren = node.children && node.children.length > 0

    return (
      <li key={node.key}>
        <button
          type="button"
          className={cn(
            'flex items-center gap-2 w-full px-4 py-2 text-sm text-left transition-colors hover:bg-muted',
            isActive && 'bg-muted font-medium text-foreground',
            !isActive && 'text-muted-foreground',
            node.disabled && 'opacity-50 cursor-not-allowed',
          )}
          disabled={node.disabled}
          onClick={() => onSelect?.(node)}
        >
          {node.icon ? <span className="flex-shrink-0">{node.icon}</span> : null}
          <span>{node.title}</span>
        </button>
        {hasChildren ? <ul className="ml-4">{node.children!.map(renderNode)}</ul> : null}
      </li>
    )
  }

  const visibleNodes = nodes.filter((n) => !n.hidden)

  return (
    <nav className={cn('flex flex-col w-64 h-full border-r bg-background', className)} {...rest}>
      <ul className="flex-1 overflow-auto py-2">{visibleNodes.map(renderNode)}</ul>
      {footer ? <div className="border-t p-4">{footer}</div> : null}
    </nav>
  )
}
