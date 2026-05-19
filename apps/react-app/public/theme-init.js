(() => {
  const payload = {"themeName":"default","defaultPreference":"system","cssByMode":{"light":":root {\n  --color-primary: #1677ff;\n  --color-primary-hover: #4096ff;\n  --color-primary-pressed: #0958d9;\n  --color-success: #52c41a;\n  --color-warning: #faad14;\n  --color-error: #ff4d4f;\n  --color-info: #1677ff;\n  --color-neutral-50: #fafafa;\n  --color-neutral-100: #f5f5f5;\n  --color-neutral-200: #e8e8e8;\n  --color-neutral-300: #d9d9d9;\n  --color-neutral-400: #bfbfbf;\n  --color-neutral-500: #8c8c8c;\n  --color-neutral-600: #595959;\n  --color-neutral-700: #434343;\n  --color-neutral-800: #262626;\n  --color-neutral-900: #1f1f1f;\n  --color-text-primary: rgba(0, 0, 0, 0.88);\n  --color-text-secondary: rgba(0, 0, 0, 0.65);\n  --color-text-tertiary: rgba(0, 0, 0, 0.45);\n  --color-text-quaternary: rgba(0, 0, 0, 0.25);\n  --color-bg-default: #ffffff;\n  --color-bg-container: #ffffff;\n  --color-bg-elevated: #ffffff;\n  --color-bg-spotlight: #f5f5f5;\n  --color-border-default: #d9d9d9;\n  --color-border-secondary: #f0f0f0;\n  --spacing-0: 0px;\n  --spacing-1: 4px;\n  --spacing-2: 8px;\n  --spacing-3: 12px;\n  --spacing-4: 16px;\n  --spacing-5: 20px;\n  --spacing-6: 24px;\n  --spacing-8: 32px;\n  --spacing-10: 40px;\n  --spacing-12: 48px;\n  --spacing-16: 64px;\n  --spacing-20: 80px;\n  --spacing-24: 96px;\n  --spacing-0.5: 2px;\n  --spacing-1.5: 6px;\n  --spacing-2.5: 10px;\n  --font-font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  --font-font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;\n  --font-font-size-xs: 12px;\n  --font-font-size-sm: 14px;\n  --font-font-size-base: 16px;\n  --font-font-size-lg: 18px;\n  --font-font-size-xl: 20px;\n  --font-font-size-2xl: 24px;\n  --font-font-size-3xl: 30px;\n  --font-font-size-4xl: 36px;\n  --font-line-height-tight: 1.25;\n  --font-line-height-normal: 1.5;\n  --font-line-height-relaxed: 1.75;\n  --font-font-weight-normal: 400;\n  --font-font-weight-medium: 500;\n  --font-font-weight-semibold: 600;\n  --font-font-weight-bold: 700;\n  --breakpoint-sm: 640px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 1024px;\n  --breakpoint-xl: 1280px;\n  --breakpoint-2xl: 1536px;\n  --shadow-none: none;\n  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n  --radius-none: 0px;\n  --radius-sm: 2px;\n  --radius-base: 4px;\n  --radius-md: 6px;\n  --radius-lg: 8px;\n  --radius-xl: 12px;\n  --radius-2xl: 16px;\n  --radius-full: 9999px;\n  --theme-color-bg-page: #ffffff;\n  --theme-color-bg-card: #ffffff;\n  --theme-color-bg-elevated: #ffffff;\n  --theme-color-text-primary: rgba(0, 0, 0, 0.88);\n  --theme-color-text-secondary: rgba(0, 0, 0, 0.65);\n  --theme-color-text-muted: rgba(0, 0, 0, 0.45);\n  --theme-color-border: #d9d9d9;\n  --theme-color-border-strong: #bfbfbf;\n  --theme-color-brand-primary: #1677ff;\n  --theme-color-brand-primary-hover: #4096ff;\n  --theme-color-brand-primary-active: #0958d9;\n  --theme-color-success: #52c41a;\n  --theme-color-warning: #faad14;\n  --theme-color-error: #ff4d4f;\n  --theme-color-info: #1677ff;\n  --theme-shadow-panel: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  --theme-shadow-raised: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);\n  --theme-radius-sm: 2px;\n  --theme-radius-md: 6px;\n  --theme-radius-lg: 8px;\n  --theme-spacing-panel-x: 24px;\n  --theme-spacing-panel-y: 24px;\n}","dark":":root {\n  --color-primary: #1677ff;\n  --color-primary-hover: #4096ff;\n  --color-primary-pressed: #0958d9;\n  --color-success: #52c41a;\n  --color-warning: #faad14;\n  --color-error: #ff4d4f;\n  --color-info: #1677ff;\n  --color-neutral-50: #fafafa;\n  --color-neutral-100: #f5f5f5;\n  --color-neutral-200: #e8e8e8;\n  --color-neutral-300: #d9d9d9;\n  --color-neutral-400: #bfbfbf;\n  --color-neutral-500: #8c8c8c;\n  --color-neutral-600: #595959;\n  --color-neutral-700: #434343;\n  --color-neutral-800: #262626;\n  --color-neutral-900: #1f1f1f;\n  --color-text-primary: rgba(0, 0, 0, 0.88);\n  --color-text-secondary: rgba(0, 0, 0, 0.65);\n  --color-text-tertiary: rgba(0, 0, 0, 0.45);\n  --color-text-quaternary: rgba(0, 0, 0, 0.25);\n  --color-bg-default: #ffffff;\n  --color-bg-container: #ffffff;\n  --color-bg-elevated: #ffffff;\n  --color-bg-spotlight: #f5f5f5;\n  --color-border-default: #d9d9d9;\n  --color-border-secondary: #f0f0f0;\n  --spacing-0: 0px;\n  --spacing-1: 4px;\n  --spacing-2: 8px;\n  --spacing-3: 12px;\n  --spacing-4: 16px;\n  --spacing-5: 20px;\n  --spacing-6: 24px;\n  --spacing-8: 32px;\n  --spacing-10: 40px;\n  --spacing-12: 48px;\n  --spacing-16: 64px;\n  --spacing-20: 80px;\n  --spacing-24: 96px;\n  --spacing-0.5: 2px;\n  --spacing-1.5: 6px;\n  --spacing-2.5: 10px;\n  --font-font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;\n  --font-font-family-code: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;\n  --font-font-size-xs: 12px;\n  --font-font-size-sm: 14px;\n  --font-font-size-base: 16px;\n  --font-font-size-lg: 18px;\n  --font-font-size-xl: 20px;\n  --font-font-size-2xl: 24px;\n  --font-font-size-3xl: 30px;\n  --font-font-size-4xl: 36px;\n  --font-line-height-tight: 1.25;\n  --font-line-height-normal: 1.5;\n  --font-line-height-relaxed: 1.75;\n  --font-font-weight-normal: 400;\n  --font-font-weight-medium: 500;\n  --font-font-weight-semibold: 600;\n  --font-font-weight-bold: 700;\n  --breakpoint-sm: 640px;\n  --breakpoint-md: 768px;\n  --breakpoint-lg: 1024px;\n  --breakpoint-xl: 1280px;\n  --breakpoint-2xl: 1536px;\n  --shadow-none: none;\n  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);\n  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);\n  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);\n  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);\n  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);\n  --radius-none: 0px;\n  --radius-sm: 2px;\n  --radius-base: 4px;\n  --radius-md: 6px;\n  --radius-lg: 8px;\n  --radius-xl: 12px;\n  --radius-2xl: 16px;\n  --radius-full: 9999px;\n  --theme-color-bg-page: #141414;\n  --theme-color-bg-card: #1f1f1f;\n  --theme-color-bg-elevated: #262626;\n  --theme-color-text-primary: #e8e8e8;\n  --theme-color-text-secondary: #bfbfbf;\n  --theme-color-text-muted: #8c8c8c;\n  --theme-color-border: #303030;\n  --theme-color-border-strong: #434343;\n  --theme-color-brand-primary: #1677ff;\n  --theme-color-brand-primary-hover: #69b1ff;\n  --theme-color-brand-primary-active: #0958d9;\n  --theme-color-success: #73d13d;\n  --theme-color-warning: #ffc53d;\n  --theme-color-error: #ff7875;\n  --theme-color-info: #69b1ff;\n  --theme-shadow-panel: 0 10px 30px rgba(0, 0, 0, 0.35);\n  --theme-shadow-raised: 0 20px 45px rgba(0, 0, 0, 0.45);\n  --theme-radius-sm: 2px;\n  --theme-radius-md: 6px;\n  --theme-radius-lg: 8px;\n  --theme-spacing-panel-x: 24px;\n  --theme-spacing-panel-y: 24px;\n}"}};
  const preferenceKey = "repo-theme-preference";
  const styleId = "repo-theme-style";

  try {
    const documentNode = globalThis.document;

    if (!documentNode) {
      return;
    }

    let preference = payload.defaultPreference;

    try {
      const storedPreference = globalThis.localStorage?.getItem(preferenceKey);

      if (storedPreference === 'light' || storedPreference === 'dark' || storedPreference === 'system') {
        preference = storedPreference;
      }
    } catch (error) {
      void error;
    }

    const systemDark = typeof globalThis.matchMedia === 'function'
      ? globalThis.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
    const resolvedMode = preference === 'system'
      ? (systemDark ? 'dark' : 'light')
      : preference;

    let styleNode = documentNode.getElementById(styleId);

    if (!styleNode) {
      styleNode = documentNode.createElement('style');
      styleNode.id = styleId;
      documentNode.head.appendChild(styleNode);
    }

    styleNode.textContent = payload.cssByMode[resolvedMode];
    documentNode.documentElement.dataset.themeName = payload.themeName;
    documentNode.documentElement.dataset.themeMode = resolvedMode;
    documentNode.documentElement.dataset.themePreference = preference;
    documentNode.documentElement.classList.toggle('dark', resolvedMode === 'dark');
  } catch (error) {
    void error;
  }
})();