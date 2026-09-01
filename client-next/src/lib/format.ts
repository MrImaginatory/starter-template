import { getLocale } from './i18n'

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR'

export function formatNumber(
  value: number,
  locale: string = getLocale(),
  options?: Intl.NumberFormatOptions,
) {
  return new Intl.NumberFormat(locale, options).format(value)
}

export function formatCompactNumber(value: number, locale: string = getLocale()) {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatPercent(value: number, locale: string = getLocale(), fractionDigits = 0) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value)
}

export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  locale: string = getLocale(),
) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export type DateStyle = 'full' | 'long' | 'medium' | 'short'

export function formatDate(
  date: Date | string,
  locale: string = getLocale(),
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
) {
  const value = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, options).format(value)
}

export function formatDateTime(date: Date | string, locale: string = getLocale()) {
  return formatDate(date, locale, { dateStyle: 'medium', timeStyle: 'short' })
}

export function toISODate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}
