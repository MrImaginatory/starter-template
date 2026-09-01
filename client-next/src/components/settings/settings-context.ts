import { createContext, useContext } from 'react'
import type { AppSettings, CustomFont } from '@/lib/settings'

export interface SettingsContextValue {
  settings: AppSettings
  setPrimaryColor: (color: string | null) => void
  setGoogleFont: (family: string | null) => void
  setCustomFont: (font: CustomFont | null) => void
  setFontScale: (scale: number) => void
  resetSettings: () => void
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within a <SettingsProvider>')
  return ctx
}
