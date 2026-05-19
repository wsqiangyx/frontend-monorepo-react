import { useEffect, useState } from 'react'
import { DataPanel, PageContainer, PermissionGate } from '@repo/ui-react'
import { usePermissionStore } from '@/platform'
import { fetchProfile, updateProfile, type ProfileRecord } from '@/services/profile-service'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

export default function ProfileView() {
  const permissionSet = usePermissionStore((state) => state.permissionSet)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileRecord | null>(null)

  const [formDisplayName, setFormDisplayName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formDepartment, setFormDepartment] = useState('')
  const [formLocale, setFormLocale] = useState<'zh-CN' | 'en-US'>('zh-CN')
  const [formThemePreference, setFormThemePreference] = useState<'system' | 'light' | 'dark'>(
    'system',
  )

  useEffect(() => {
    let cancelled = false

    void (async () => {
      setLoading(true)
      try {
        const data = await fetchProfile()
        if (cancelled) {
          return
        }
        setProfile(data)
        setFormDisplayName(data.displayName)
        setFormEmail(data.email)
        setFormPhone(data.phone)
        setFormDepartment(data.department)
        setFormLocale(data.locale)
        setFormThemePreference(data.themePreference)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await updateProfile({
        displayName: formDisplayName,
        email: formEmail,
        phone: formPhone,
        department: formDepartment,
        locale: formLocale,
        themePreference: formThemePreference,
      })
      setProfile(updated)
      // Sync locale and theme to stores for immediate effect
      useLocaleStore.getState().setLocale(formLocale)
      useThemeStore.getState().setPreference(formThemePreference)
    } finally {
      setSaving(false)
    }
  }

  if (!profile && !loading) {
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
        loading={loading}
        loadingText="正在加载用户资料..."
        empty={!loading && !profile}
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
        loading={saving}
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
            <button
              type="button"
              className="page-primary-button"
              disabled={saving}
              onClick={handleSave}
            >
              保存
            </button>
          </PermissionGate>
        </div>
      </DataPanel>
    </PageContainer>
  )
}
