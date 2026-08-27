import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { config } from '@/config'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const APP_NAME = config.app.name
export const THEME_STORAGE_KEY = 'starter-kit-theme'
