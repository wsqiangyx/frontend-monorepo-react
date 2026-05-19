import { mergeMessages, sharedMessages, type Messages } from '@repo/shared/i18n'

const reactAppMessages: Messages = {
  'zh-CN': {
    'home.title': 'React 应用',
    'home.subtitle': 'Shared theme provider、shell components 与 mock 数据链路已从应用根部接入。',
    'home.toggleTheme': '切换主题模式',
    'home.toggleLanguage': '切换语言',
    'home.themeMode': '主题',
    'home.modeSystem': '跟随系统',
    'home.modeLight': '浅色',
    'home.modeDark': '深色',
    'login.title': '登录',
    'login.username': '用户名',
    'login.password': '密码',
    'login.submit': '登录',
    'login.error': '登录失败',
    'dashboard.title': '仪表盘',
    logout: '退出登录',
  },
  'en-US': {
    'home.title': 'React App',
    'home.subtitle':
      'Shared theme provider, shell components, and mock-backed data are wired through the app root.',
    'home.toggleTheme': 'Toggle theme mode',
    'home.toggleLanguage': 'Switch language',
    'home.themeMode': 'Theme',
    'home.modeSystem': 'System',
    'home.modeLight': 'Light',
    'home.modeDark': 'Dark',
    'login.title': 'Login',
    'login.username': 'Username',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.error': 'Login failed',
    'dashboard.title': 'Dashboard',
    logout: 'Logout',
  },
}

export const reactAppI18nMessages = mergeMessages(sharedMessages, reactAppMessages)
