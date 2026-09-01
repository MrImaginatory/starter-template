export type Locale = string

type Dictionary = Record<string, string>

let currentLocale: Locale = 'en'

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    'common.today': 'Today',
    'common.clear': 'Clear',
    'common.confirm': 'Confirm',
    'common.cancel': 'Cancel',
    'common.close': 'Close',
    'common.dismiss': 'Dismiss',
    'common.loading': 'Loading',
    'common.remove': 'Remove',

    'dialog.close': 'Close',

    'toast.notifications': 'Notifications',
    'toast.dismiss': 'Dismiss notification',

    'pagination.summary': 'Page {{page}} of {{total}}',
    'pagination.previous': 'Previous page',
    'pagination.next': 'Next page',

    'datePicker.previousMonth': 'Previous month',
    'datePicker.nextMonth': 'Next month',
    'datePicker.calendar': 'Calendar',

    'select.noResults': 'No results found',

    'multiSelect.placeholder': 'Select options…',
    'multiSelect.search': 'Search options…',
    'multiSelect.noResults': 'No results found',
    'multiSelect.clearAll': 'Clear all',
    'multiSelect.selectedCount': '{{count}} selected',
    'multiSelect.removeOption': 'Remove {{label}}',
  },
}

export function getLocale(): Locale {
  return currentLocale
}

export function registerDictionary(locale: Locale, dictionary: Dictionary) {
  dictionaries[locale] = { ...dictionaries[locale], ...dictionary }
}

export function setLocale(locale: Locale) {
  currentLocale = locale
}

function interpolate(template: string, params?: Record<string, string | number>) {
  if (!params) return template
  return template.replace(/{{(\w+)}}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`,
  )
}

export function translate(key: string, params?: Record<string, string | number>): string {
  const dictionary = dictionaries[currentLocale] ?? dictionaries.en
  const template = dictionary[key] ?? dictionaries.en[key] ?? key
  return interpolate(template, params)
}

export interface Translation {
  t: (key: string, params?: Record<string, string | number>) => string
  locale: Locale
}

export function useTranslation(): Translation {
  return { t: translate, locale: currentLocale }
}
