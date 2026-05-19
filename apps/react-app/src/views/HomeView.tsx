import { ThemeModeSwitch } from '@repo/shared-ui'
import { useI18n } from '@/i18n'
import { useThemeStore } from '@/stores/theme'

export default function HomeView() {
  const { locale, setLocale, t } = useI18n()
  const preference = useThemeStore((state) => state.preference)
  const setPreference = useThemeStore((state) => state.setPreference)
  const nextLocale = locale === 'zh-CN' ? 'en-US' : 'zh-CN'

  return (
    <div className="home">
      <h1 className="home-title">{t('home.title')}</h1>
      <p className="home-subtitle">{t('home.subtitle')}</p>
      <div className="home-actions">
        <button
          aria-label={t('home.toggleLanguage')}
          onClick={() => setLocale(nextLocale)}
          className="home-lang-btn"
        >
          {nextLocale === 'zh-CN' ? '中文' : 'EN'}
        </button>
        <ThemeModeSwitch
          preference={preference}
          label={t('home.themeMode')}
          systemText={t('home.modeSystem')}
          lightText={t('home.modeLight')}
          darkText={t('home.modeDark')}
          ariaLabel={t('home.toggleTheme')}
          onChange={setPreference}
        />
      </div>
    </div>
  )
}
