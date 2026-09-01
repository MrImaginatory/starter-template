import { BRAND_STEPS, generateBrandScale } from './brand-scale'

export const SETTINGS_STORAGE_KEY = 'starter-kit-settings'

export const FONT_SIZE_STEPS = [
  { label: 'xs', size: 13 },
  { label: 's', size: 14 },
  { label: 'm', size: 16 },
  { label: 'l', size: 18 },
  { label: 'xl', size: 20 },
  { label: 'xxl', size: 22 },
] as const

export const DEFAULT_FONT_SCALE = 2

export const GOOGLE_FONTS = [
  'Inter',
  'Poppins',
  'Montserrat',
  'Open Sans',
  'Roboto',
  'Lora',
  'Nunito Sans',
  'Source Sans 3',
  'Work Sans',
  'IBM Plex Sans',
  'Fira Sans',
  'Playfair Display',
] as const

export const CUSTOM_FONT_FAMILY = 'App Custom Font'
export const MAX_CUSTOM_FONT_BYTES = 2 * 1024 * 1024

export interface CustomFont {
  name: string
  dataUrl: string
}

export interface AppSettings {
  primaryColor: string | null
  googleFont: string | null
  customFont: CustomFont | null
  fontScale: number
}

export const DEFAULT_SETTINGS: AppSettings = {
  primaryColor: null,
  googleFont: null,
  customFont: null,
  fontScale: DEFAULT_FONT_SCALE,
}

export function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return { ...DEFAULT_SETTINGS }
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw) as Partial<AppSettings>
    return {
      primaryColor: typeof parsed.primaryColor === 'string' ? parsed.primaryColor : null,
      googleFont: typeof parsed.googleFont === 'string' ? parsed.googleFont : null,
      customFont:
        parsed.customFont && typeof parsed.customFont === 'object' && typeof parsed.customFont.dataUrl === 'string'
          ? parsed.customFont
          : null,
      fontScale: Number.isInteger(parsed.fontScale) && parsed.fontScale! >= 0 && parsed.fontScale! < FONT_SIZE_STEPS.length
        ? parsed.fontScale!
        : DEFAULT_FONT_SCALE,
    }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: AppSettings) {
  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  } catch {
    /* storage full or unavailable */
  }
}

export function clearSettingsStorage() {
  try {
    window.localStorage.removeItem(SETTINGS_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function applyFontSize(scale: number) {
  const clamped = Math.min(Math.max(scale, 0), FONT_SIZE_STEPS.length - 1)
  document.documentElement.style.fontSize = `${FONT_SIZE_STEPS[clamped].size}px`
}

export function applyPrimaryColor(color: string | null) {
  const root = document.documentElement
  if (!color) {
    for (const step of BRAND_STEPS) {
      root.style.removeProperty(`--color-brand-${step}`)
    }
    return
  }
  const scale = generateBrandScale(color)
  if (!scale) return
  for (const step of BRAND_STEPS) {
    root.style.setProperty(`--color-brand-${step}`, scale[step])
  }
}

export function applyFontFamily(family: string | null) {
  const root = document.documentElement
  if (!family) {
    root.style.removeProperty('--font-sans')
    return
  }
  root.style.setProperty(
    '--font-sans',
    `"${family}", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`,
  )
}

let loadedFontDataUrl: string | null = null

export async function loadCustomFont(dataUrl: string): Promise<void> {
  if (loadedFontDataUrl === dataUrl) return
  const response = await fetch(dataUrl)
  const buffer = await response.arrayBuffer()
  const face = new FontFace(CUSTOM_FONT_FAMILY, buffer, { weight: '100 900' })
  await face.load()
  document.fonts.add(face)
  loadedFontDataUrl = dataUrl
}

export function ensureGoogleFont(family: string) {
  const id = `google-font-${family.toLowerCase().replace(/\s+/g, '-')}`
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`
  document.head.appendChild(link)
}

export async function applySettings(settings: AppSettings) {
  applyFontSize(settings.fontScale)
  applyPrimaryColor(settings.primaryColor)

  if (settings.customFont) {
    try {
      await loadCustomFont(settings.customFont.dataUrl)
      applyFontFamily(CUSTOM_FONT_FAMILY)
    } catch {
      applyFontFamily(null)
    }
    return
  }

  if (settings.googleFont) {
    ensureGoogleFont(settings.googleFont)
    applyFontFamily(settings.googleFont)
    return
  }

  applyFontFamily(null)
}

export function applySavedSettings() {
  const settings = loadSettings()
  applyFontSize(settings.fontScale)
  applyPrimaryColor(settings.primaryColor)
  if (settings.googleFont) {
    ensureGoogleFont(settings.googleFont)
    applyFontFamily(settings.googleFont)
  }
  if (settings.customFont) {
    void loadCustomFont(settings.customFont.dataUrl)
      .then(() => applyFontFamily(CUSTOM_FONT_FAMILY))
      .catch(() => applyFontFamily(null))
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
