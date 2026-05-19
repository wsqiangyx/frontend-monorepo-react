import { useEffect, useState } from 'react'
import { DataPanel, PageContainer, PermissionGate } from '@repo/shared-ui'
import { usePermissionStore } from '@/platform'
import { fetchRoles, type RoleRecord } from '@/services/role-service'

export default function RoleListView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<RoleRecord[]>([])

  useEffect(() => {
    void (async () => {
      setLoading(true)
      try {
        const result = await fetchRoles()
        setRoles(result.items)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <PageContainer title="角色管理">
      <DataPanel
        title="角色列表"
        description="聚焦角色职责、权限规模与使用人数。"
        loading={loading}
        loadingText="正在加载角色数据..."
        empty={!loading && roles.length === 0}
        emptyContent={<div className="page-empty">暂无角色数据。</div>}
        toolbar={
          <PermissionGate permissionSet={permissionSet} code="system:role:create">
            <button type="button" className="page-primary-button">
              新增角色
            </button>
          </PermissionGate>
        }
      >
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
