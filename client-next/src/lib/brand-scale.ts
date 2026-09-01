export const BRAND_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

const LIGHTNESS = [0.962, 0.93, 0.87, 0.785, 0.673, 0.585, 0.511, 0.457, 0.398, 0.359, 0.257]
const CHROMA = [0.018, 0.034, 0.065, 0.115, 0.182, 0.233, 0.262, 0.24, 0.195, 0.144, 0.09]

export interface Oklch {
  l: number
  c: number
  h: number
}

export function hexToOklch(hex: string): Oklch | null {
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return null

  let value = match[1]
  if (value.length === 3) {
    value = value
      .split('')
      .map((ch) => ch + ch)
      .join('')
  }

  const r = parseInt(value.slice(0, 2), 16) / 255
  const g = parseInt(value.slice(2, 4), 16) / 255
  const b = parseInt(value.slice(4, 6), 16) / 255

  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const rl = lin(r)
  const gl = lin(g)
  const bl = lin(b)

  const l = Math.cbrt(0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl)
  const m = Math.cbrt(0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl)
  const s = Math.cbrt(0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl)

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s

  const c = Math.sqrt(a * a + b2 * b2)
  let h = (Math.atan2(b2, a) * 180) / Math.PI
  if (h < 0) h += 360

  return { l: L, c, h }
}

export function generateBrandScale(hex: string): Record<number, string> | null {
  const base = hexToOklch(hex)
  if (!base) return null

  const saturation = base.c > 0.001 ? Math.min(1.15, base.c / CHROMA[6]) : 0

  const scale: Record<number, string> = {}
  BRAND_STEPS.forEach((step, i) => {
    const c = Math.min(CHROMA[i], CHROMA[i] * saturation)
    scale[step] = `oklch(${LIGHTNESS[i].toFixed(3)} ${c.toFixed(3)} ${base.h.toFixed(1)})`
  })
  return scale
}

export const BRAND_PRESETS = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Violet', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Fuchsia', value: '#d946ef' },
] as const
