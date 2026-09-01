'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { CircleAlert, Info } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'
}

type ConfirmFn = (options: ConfirmOptions) => Promise<boolean>

const ConfirmContext = createContext<ConfirmFn | null>(null)

export function useConfirm(): ConfirmFn {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error('useConfirm must be used within a <ConfirmProvider>')
  return ctx
}

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ options: ConfirmOptions; resolve: (value: boolean) => void } | null>(null)

  const confirm = useCallback<ConfirmFn>(
    (options) => new Promise<boolean>((resolve) => setState({ options, resolve })),
    [],
  )

  const close = useCallback(
    (value: boolean) => {
      setState((current) => {
        current?.resolve(value)
        return null
      })
    },
    [],
  )

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {/* Confirm dialog will be fully implemented in Phase 4 */}
      {state && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-overlay">
          <div className="rounded-xl bg-surface p-6 shadow-xl max-w-sm w-full mx-4">
            <p className="text-fg font-semibold">{state.options.title}</p>
            {state.options.description && (
              <p className="text-fg-muted mt-1 text-sm">{state.options.description}</p>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => close(false)}
                className="px-4 py-2 text-sm text-fg-muted hover:text-fg"
              >
                {state.options.cancelLabel ?? 'Cancel'}
              </button>
              <button
                onClick={() => close(true)}
                className="px-4 py-2 text-sm rounded-lg bg-primary text-primary-fg hover:bg-primary-hover"
              >
                {state.options.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  )
}
