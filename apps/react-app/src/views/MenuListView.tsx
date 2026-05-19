import { useEffect, useState } from 'react'
import { DataPanel, FilterBar, PageContainer, PermissionGate, StatusTag } from '@repo/ui-react'
import { usePermissionStore } from '@/platform'
import { fetchMenus, type MenuRecord } from '@/services/menu-service'

export default function MenuListView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)
  const [keyword, setKeyword] = useState('')
  const [typeFilter, setTypeFilter] = useState<'directory' | 'route' | ''>('')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [menus, setMenus] = useState<MenuRecord[]>([])
  const [total, setTotal] = useState(0)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  async function loadMenus(
    opts: { keyword?: string; type?: 'directory' | 'route'; page?: number; reset?: boolean } = {},
  ) {
    const kw = opts.keyword ?? keyword
    const tp = opts.type ?? typeFilter
    const pg = opts.page ?? page
    if (opts.reset) {
      setKeyword('')
      setTypeFilter('')
      setPage(1)
    }
    setLoading(true)
    try {
      const result = await fetchMenus({
        keyword: kw.trim() || undefined,
        type: tp || undefined,
        page: opts.reset ? 1 : pg,
        pageSize,
      })
      setMenus(result.items)
      setTotal(result.total)
    } finally {
      setLoading(false)
    }
  }

  function goPage(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
    void loadMenus({ keyword, type: typeFilter, page: p })
  }

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      setLoading(true)
      try {
        const result = await fetchMenus({ page: 1, pageSize: 10 })
        if (cancelled) return
        setMenus(result.items)
        setTotal(result.total)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void bootstrap()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageContainer title="菜单管理">
      <DataPanel
        title="菜单列表"
        description="展示平台菜单定义，支持关键字与类型筛选。"
        loading={loading}
        loadingText="正在加载菜单数据..."
        empty={!loading && menus.length === 0}
        emptyContent={<div className="page-empty">未查询到匹配菜单。</div>}
        toolbar={
          <PermissionGate permissionSet={permissionSet} code="system:menu:create">
            <button type="button" className="page-primary-button">
              新增菜单
            </button>
          </PermissionGate>
        }
      >
        <FilterBar
          actions={
            <div className="page-filter-actions">
              <button
                type="button"
                className="page-secondary-button"
                onClick={() => void loadMenus({ keyword: '', type: '', reset: true })}
              >
                重置
              </button>
              <button
                type="button"
                className="page-primary-button"
                onClick={() => void loadMenus()}
              >
                查询
              </button>
            </div>
          }
        >
          <div className="filter-group">
            <label className="page-filter-field">
              <span>关键字</span>
              <input
                className="page-filter-input"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    void loadMenus()
                  }
                }}
                placeholder="搜索标题 / 键 / 路径"
              />
            </label>
            <label className="page-filter-field">
              <span>类型</span>
              <select
                className="page-filter-select"
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value as 'directory' | 'route' | '')
                }
              >
                <option value="">全部</option>
                <option value="directory">目录</option>
                <option value="route">路由</option>
              </select>
            </label>
          </div>
        </FilterBar>

        <div className="page-summary">
          共 {total} 个菜单
          {totalPages > 1 && (
            <span className="pagination">
              <button type="button" disabled={page <= 1} onClick={() => goPage(page - 1)}>
                上一页
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button type="button" disabled={page >= totalPages} onClick={() => goPage(page + 1)}>
                下一页
              </button>
            </span>
          )}
        </div>

        <div className="data-table">
          <div className="data-table__row data-table__row--head">
            <span>键</span>
            <span>标题</span>
            <span>路径</span>
            <span>父级</span>
            <span>类型</span>
            <span>排序</span>
            <span>权限码</span>
            <span>可见</span>
            <span>操作</span>
          </div>
          {menus.map((item) => (
            <div key={item.id} className="data-table__row">
              <span className="mono">{item.key}</span>
              <span>{item.title}</span>
              <span className="mono">{item.path ?? '-'}</span>
              <span className="mono">{item.parentKey ?? '-'}</span>
              <span>
                <StatusTag
                  status={item.type === 'directory' ? 'info' : 'success'}
                  label={item.type === 'directory' ? '目录' : '路由'}
                />
              </span>
              <span>{item.order}</span>
              <span className="permissions-cell">
                {item.permissionCodes.map((code) => (
                  <code key={code}>{code}</code>
                ))}
              </span>
              <span>
                <StatusTag
                  status={item.hidden ? 'warning' : 'neutral'}
                  label={item.hidden ? '隐藏' : '显示'}
                />
              </span>
              <span className="action-cell">
                <PermissionGate permissionSet={permissionSet} code="system:menu:edit">
                  <button type="button" className="page-link-button">
                    编辑
                  </button>
                </PermissionGate>
                <PermissionGate permissionSet={permissionSet} code="system:menu:delete">
                  <button type="button" className="page-link-button page-link-button--danger">
                    删除
                  </button>
                </PermissionGate>
              </span>
            </div>
          ))}
        </div>
      </DataPanel>
    </PageContainer>
  )
}
