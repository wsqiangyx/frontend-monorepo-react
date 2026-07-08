import type { HTMLAttributes } from 'react'
import type { ThemePreference } from '@repo/design-tokens/theme'
import { cn } from '../lib/utils'

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
      className={cn('inline-grid gap-2', className)}
      role="radiogroup"
    >
      <span className="text-sm font-semibold">{label}</span>
      <div className="inline-flex gap-1 p-1 bg-elevated border border-border rounded-full">
        {options.map((option) => (
          <button
            key={option.value}
            aria-checked={preference === option.value}
            className={cn(
              'px-3 py-1.5 text-sm rounded-full transition-colors',
              preference === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground',
            )}
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
