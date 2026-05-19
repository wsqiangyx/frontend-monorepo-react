import type { HTMLAttributes } from 'react'
import type { ThemePreference } from '@repo/ui-tokens/theme'

interface ThemeModeSwitchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  preference: ThemePreference
  label: string
  systemText: string
  lightText: string
  darkText: string
  onChange: (nextPreference: ThemePreference) => void
  ariaLabel?: string
}

export function ThemeModeSwitch({
  preference,
  label,
  systemText,
  lightText,
  darkText,
  onChange,
  ariaLabel,
  className,
  ...rest
}: ThemeModeSwitchProps) {
  const options = [
    { value: 'system', text: systemText },
    { value: 'light', text: lightText },
    { value: 'dark', text: darkText },
  ] as const

  return (
    <div
      {...rest}
      aria-label={ariaLabel}
      className={['repo-theme-mode-switch', className].filter(Boolean).join(' ')}
      role="radiogroup"
    >
      <span className="repo-theme-mode-switch-label">{label}</span>
      <div className="repo-theme-mode-switch-options">
        {options.map((option) => (
          <button
            key={option.value}
            aria-checked={preference === option.value}
            className="repo-theme-mode-switch-option"
            data-active={preference === option.value}
            role="radio"
            tabIndex={preference === option.value ? 0 : -1}
            type="button"
            onClick={() => {
              onChange(option.value)
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  )
}
