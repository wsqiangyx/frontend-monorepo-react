import { useQuery } from '@tanstack/react-query'
import { DataPanel, PageContainer, PermissionGate } from '@repo/shared-ui'
import { usePermissionStore } from '@/platform'
import { fetchRoles } from '@/services/role-service'
import { roleKeys } from '@/lib/query-keys'

export default function RoleListView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: roleKeys.list(),
    queryFn: fetchRoles,
  })

  const roles = result?.items ?? []

  return (
    <PageContainer title="角色管理">
      <DataPanel
        title="角色列表"
        description="聚焦角色职责、权限规模与使用人数。"
        loading={isLoading}
        loadingText="正在加载角色数据..."
        empty={!isLoading && !error && roles.length === 0}
        emptyContent={<div className="page-empty">暂无角色数据。</div>}
        toolbar={
          <PermissionGate permissionSet={permissionSet} code="system:role:create">
            <button type="button" className="page-primary-button">
              新增角色
            </button>
          </PermissionGate>
        }
      >
        {error && <div className="page-error">加载失败：{error.message}</div>}
        <div className="role-grid">
          {roles.map((role) => (
            <article key={role.key} className="role-card">
              <header className="role-card__header">
                <h3>{role.name}</h3>
                <span>{role.key}</span>
              </header>
              <p className="role-card__desc">{role.description}</p>
              <dl className="role-card__meta">
                <div>
                  <dt>权限数</dt>
                  <dd>{role.permissions.length}</dd>
                </div>
                <div>
                  <dt>用户数</dt>
                  <dd>{role.userCount}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </DataPanel>
    </PageContainer>
  )
}
