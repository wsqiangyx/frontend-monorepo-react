import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { DataPanel, PageContainer, PermissionGate } from '@repo/shared-ui'
import { usePermissionStore } from '@/platform'
import { fetchProfile, updateProfile } from '@/services/profile-service'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'
import { profileKeys } from '@/lib/query-keys'

export default function ProfileView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: profileKeys.detail(),
    queryFn: fetchProfile,
  })

  const [formDisplayName, setFormDisplayName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formDepartment, setFormDepartment] = useState('')
  const [formLocale, setFormLocale] = useState<'zh-CN' | 'en-US'>('zh-CN')
  const [formThemePreference, setFormThemePreference] = useState<'system' | 'light' | 'dark'>(
    'system',
  )

  // 当 profile 数据加载后，初始化表单
  const [formInitialized, setFormInitialized] = useState(false)
  if (profile && !formInitialized) {
    setFormDisplayName(profile.displayName)
    setFormEmail(profile.email)
    setFormPhone(profile.phone)
    setFormDepartment(profile.department)
    setFormLocale(profile.locale)
    setFormThemePreference(profile.themePreference)
    setFormInitialized(true)
  }

  async function handleSave() {
    const updated = await updateProfile({
      displayName: formDisplayName,
      email: formEmail,
      phone: formPhone,
      department: formDepartment,
      locale: formLocale,
      themePreference: formThemePreference,
    })
    // 使缓存失效，触发重新获取最新数据
    await queryClient.invalidateQueries({ queryKey: profileKeys.all })
    // 同步 locale 和 theme 到 store
    useLocaleStore.getState().setLocale(formLocale)
    useThemeStore.getState().setPreference(formThemePreference)
    void updated // updated 用于类型安全，实际刷新由 invalidateQueries 触发
  }

  if (!profile && !isLoading) {
    return (
      <PageContainer title="个人中心">
        <DataPanel
          title="基础资料"
          description="当前登录用户的资料信息。"
          loading={false}
          loadingText="正在加载用户资料..."
          empty
          emptyContent={<div className="page-empty">暂无用户资料。</div>}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer title="个人中心">
      <DataPanel
        title="基础资料"
        description="当前登录用户的资料信息，支持部分字段更新。"
        loading={isLoading}
        loadingText="正在加载用户资料..."
        empty={!isLoading && !profile}
        emptyContent={<div className="page-empty">暂无用户资料。</div>}
      >
        {profile && (
          <div className="meta-grid">
            <article className="meta-card">
              <span>用户名</span>
              <strong>{profile.name}</strong>
            </article>
            <article className="meta-card">
              <span>昵称</span>
              <input
                className="meta-input"
                value={formDisplayName}
                onChange={(e) => setFormDisplayName(e.target.value)}
              />
            </article>
            <article className="meta-card">
              <span>邮箱</span>
              <input
                className="meta-input"
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </article>
            <article className="meta-card">
              <span>手机</span>
              <input
                className="meta-input"
                type="tel"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
              />
            </article>
            <article className="meta-card">
              <span>角色</span>
              <strong>{profile.roleLabel}</strong>
            </article>
            <article className="meta-card">
              <span>部门</span>
              <input
                className="meta-input"
                value={formDepartment}
                onChange={(e) => setFormDepartment(e.target.value)}
              />
            </article>
            <article className="meta-card">
              <span>最近登录</span>
              <strong>{profile.lastLoginAt}</strong>
            </article>
          </div>
        )}
      </DataPanel>

      <DataPanel
        title="偏好设置"
        description="修改语言和主题偏好，保存后立即生效。"
        loading={false}
        loadingText="正在保存..."
      >
        <div className="pref-row">
          <label className="pref-field">
            <span>语言</span>
            <select
              className="pref-select"
              value={formLocale}
              onChange={(e) => setFormLocale(e.target.value as 'zh-CN' | 'en-US')}
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
            </select>
          </label>
          <label className="pref-field">
            <span>主题</span>
            <select
              className="pref-select"
              value={formThemePreference}
              onChange={(e) =>
                setFormThemePreference(e.target.value as 'system' | 'light' | 'dark')
              }
            >
              <option value="system">跟随系统</option>
              <option value="light">浅色</option>
              <option value="dark">深色</option>
            </select>
          </label>
        </div>

        <div className="save-row">
          <PermissionGate permissionSet={permissionSet} code="system:profile:update">
            <button type="button" className="page-primary-button" onClick={handleSave}>
              保存
            </button>
          </PermissionGate>
        </div>
      </DataPanel>
    </PageContainer>
  )
}
