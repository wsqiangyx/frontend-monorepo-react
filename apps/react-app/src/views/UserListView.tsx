import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataPanel, FilterBar, PageContainer, PermissionGate, StatusTag } from '@repo/shared-ui'
import { usePermissionStore } from '@/platform'
import { fetchUsers, type UserRecord } from '@/services/user-service'
import { userKeys } from '@/lib/query-keys'

export default function UserListView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)
  const [keyword, setKeyword] = useState('')

  const { data: result, isLoading } = useQuery({
    queryKey: userKeys.list({ keyword: keyword || undefined, page: 1, pageSize: 10 }),
    queryFn: () => fetchUsers({ keyword: keyword || undefined, page: 1, pageSize: 10 }),
  })

  const users = result?.items ?? []
  const total = result?.total ?? 0

  return (
    <PageContainer title="用户管理">
      <DataPanel
        title="用户列表"
        description="基于平台 Mock 契约演示列表、筛选与权限按钮控制。"
        loading={isLoading}
        loadingText="正在加载用户数据..."
        empty={!isLoading && users.length === 0}
        emptyContent={<div className="page-empty">未查询到匹配用户。</div>}
        toolbar={
          <PermissionGate permissionSet={permissionSet} code="system:user:create">
            <button type="button" className="page-primary-button">
              新增用户
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
                onClick={() => setKeyword('')}
              >
                重置
              </button>
            </div>
          }
        >
          <label className="page-filter-field">
            <span>关键字</span>
            <input
              className="page-filter-input"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索用户名 / 昵称 / 邮箱"
            />
          </label>
        </FilterBar>

        <div className="page-summary">共 {total} 个用户</div>

        <div className="data-table">
          <div className="data-table__row data-table__row--head">
            <span>账号</span>
            <span>昵称</span>
            <span>角色</span>
            <span>部门</span>
            <span>状态</span>
            <span>最近登录</span>
          </div>
          {users.map((item: UserRecord) => (
            <div key={item.id} className="data-table__row">
              <span>{item.username}</span>
              <span>{item.displayName}</span>
              <span>{item.roleLabel}</span>
              <span>{item.department}</span>
              <span>
                <StatusTag
                  status={item.status === 'active' ? 'success' : 'neutral'}
                  label={item.status === 'active' ? '启用' : '停用'}
                />
              </span>
              <span>{item.lastLoginAt}</span>
            </div>
          ))}
        </div>
      </DataPanel>
    </PageContainer>
  )
}
