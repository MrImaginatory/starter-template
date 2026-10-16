'use client'
import { useCallback, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import {
  applySettings,
  clearSettingsStorage,
  DEFAULT_SETTINGS,
  getSettingsSnapshot,
  saveSettings,
  subscribeSettings,
  type AppSettings,
  type CustomFont,
} from '@/lib/settings'
import { SettingsContext, type SettingsContextValue } from './settings-context'

export function SettingsProvider({ children }: { children: ReactNode }) {
  // Server snapshot = defaults, client snapshot = localStorage — hydration-safe.
  const settings = useSyncExternalStore<AppSettings>(
    subscribeSettings,
    getSettingsSnapshot,
    () => DEFAULT_SETTINGS,
  )
  const [panelOpen, setPanelOpen] = useState(false)

  useEffect(() => {
    void applySettings(settings)
  }, [settings])

  const update = useCallback((patch: Partial<AppSettings>) => {
    saveSettings({ ...getSettingsSnapshot(), ...patch })
  }, [])

  const setPrimaryColor = useCallback((color: string | null) => update({ primaryColor: color }), [update])
  const setGoogleFont = useCallback((family: string | null) => update({ googleFont: family }), [update])
  const setCustomFont = useCallback((font: CustomFont | null) => update({ customFont: font }), [update])
  const setFontScale = useCallback((scale: number) => update({ fontScale: scale }), [update])

  const resetSettings = useCallback(() => {
    clearSettingsStorage()
  }, [])

  const value: SettingsContextValue = {
    settings,
    setPrimaryColor,
    setGoogleFont,
    setCustomFont,
    setFontScale,
    resetSettings,
    panelOpen,
    setPanelOpen,
  }

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
