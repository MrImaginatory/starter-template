'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { THEME_STORAGE_KEY } from '@/lib/utils'
import {
  ThemeContext,
  type ResolvedTheme,
  type ThemeContextValue,
  type ThemeMode,
} from './theme-context'

function getStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : 'system'
}

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: ResolvedTheme) {
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

function subscribeToSystemTheme(onChange: (theme: ResolvedTheme) => void) {
  if (typeof window === 'undefined') return () => {}
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (event: MediaQueryListEvent) => onChange(event.matches ? 'dark' : 'light')
  media.addEventListener('change', handler)
  return () => media.removeEventListener('change', handler)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getStoredMode)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  useEffect(() => subscribeToSystemTheme(setSystemTheme), [])

  const resolvedTheme = mode === 'system' ? systemTheme : mode

  useEffect(() => {
    applyTheme(resolvedTheme)
    window.localStorage.setItem(THEME_STORAGE_KEY, mode)
  }, [mode, resolvedTheme])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])

  const value: ThemeContextValue = { mode, resolvedTheme, setMode }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
