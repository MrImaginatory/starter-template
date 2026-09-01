'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export type ToastVariant = 'success' | 'info' | 'warning' | 'danger'

export interface ToastOptions {
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

interface ToastItem extends Required<Pick<ToastOptions, 'title' | 'variant'>> {
  id: number
  description?: string
  duration?: number
  open: boolean
}

export interface ToastApi {
  (options: ToastOptions): void
  success: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  danger: (title: string, description?: string) => void
}

const ToastContext = createContext<ToastApi | null>(null)

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}

const variantIcons = {
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  danger: CircleAlert,
} as const

const variantTextColors = {
  success: 'text-success-text',
  info: 'text-info-text',
  warning: 'text-warning-text',
  danger: 'text-danger-text',
} as const

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const { t } = useTranslation()

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, open: false } : t)))
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 400)
  }, [])

  const push = useCallback((options: ToastOptions) => {
    const id = ++nextId
    setToasts((prev) => [
      ...prev.slice(-3),
      {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? 'info',
        duration: options.duration,
        open: true,
      },
    ])
  }, [])

  const toast = useMemo<ToastApi>(() => {
    const fn: ToastApi = Object.assign(
      (options: ToastOptions) => push(options),
      {
        success: (title: string, description?: string) => push({ title, description, variant: 'success' }),
        info: (title: string, description?: string) => push({ title, description, variant: 'info' }),
        warning: (title: string, description?: string) => push({ title, description, variant: 'warning' }),
        danger: (title: string, description?: string) => push({ title, description, variant: 'danger' }),
      },
    )
    return fn
  }, [push])

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>
      <ToastPrimitive.Viewport
        className="fixed bottom-0 right-0 z-[100] flex w-full max-w-sm flex-col gap-2 p-4 outline-none"
        label={t('toast.notifications')}
      >
        {toasts.map((item) => {
          const Icon = variantIcons[item.variant]
          return (
            <ToastPrimitive.Root
              key={item.id}
              duration={item.duration ?? 5000}
              open={item.open}
              onOpenChange={(open) => {
                if (!open) dismiss(item.id)
              }}
              className={cn(
                'flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-lg',
                'data-[state=open]:animate-toast-in data-[state=closed]:animate-fade-out',
                'data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-toast-swipe-out',
              )}
            >
              <Icon
                aria-hidden="true"
                className={cn('mt-0.5 size-4.5 shrink-0', variantTextColors[item.variant])}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-fg">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-sm leading-relaxed text-fg-muted">{item.description}</p>
                )}
              </div>
              <ToastPrimitive.Close
                aria-label={t('toast.dismiss')}
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-fg-subtle outline-none transition-colors hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring/60 [&_svg]:size-3.5"
              >
                <X aria-hidden="true" />
              </ToastPrimitive.Close>
            </ToastPrimitive.Root>
          )
        })}
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Provider>
  )
}
