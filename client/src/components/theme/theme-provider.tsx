import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from 'react'
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

// localStorage is the source of truth for the theme mode; listeners re-read it
// after writes (and after cross-tab `storage` events).
const modeListeners = new Set<() => void>()

function subscribeMode(onChange: () => void) {
  modeListeners.add(onChange)
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onChange()
  }
  window.addEventListener('storage', onStorage)
  return () => {
    modeListeners.delete(onChange)
    window.removeEventListener('storage', onStorage)
  }
}

function emitModeChange() {
  modeListeners.forEach((listener) => listener())
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore serves the server snapshot during hydration and the
  // client snapshot afterwards — no markup mismatch, no setState-in-effect.
  const mode = useSyncExternalStore<ThemeMode>(subscribeMode, getStoredMode, () => 'system')
  const systemTheme = useSyncExternalStore<ResolvedTheme>(
    subscribeToSystemTheme,
    getSystemTheme,
    () => 'light',
  )

  useEffect(() => {
    applyTheme(mode === 'system' ? systemTheme : mode)
  }, [mode, systemTheme])

  const setMode = useCallback((next: ThemeMode) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, next)
    emitModeChange()
  }, [])

  const resolvedTheme = mode === 'system' ? systemTheme : mode
  const value: ThemeContextValue = { mode, resolvedTheme, setMode }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
