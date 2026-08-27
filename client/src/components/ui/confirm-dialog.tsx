import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react'
import { CircleAlert, Info } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { Button } from './button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog'

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

  const variant = state?.options.variant ?? 'danger'
  const Icon = variant === 'danger' ? CircleAlert : Info
  const { t } = useTranslation()

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <Dialog open={state !== null} onOpenChange={(open) => !open && close(false)}>
        {state && (
          <DialogContent size="sm" hideClose className="max-w-sm">
            <div className="flex gap-4">
              <span
                className={
                  variant === 'danger'
                    ? 'flex size-10 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger-text'
                    : 'flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-text'
                }
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <DialogHeader className="mb-0 pr-0">
                <DialogTitle>{state.options.title}</DialogTitle>
                {state.options.description && (
                  <DialogDescription>{state.options.description}</DialogDescription>
                )}
              </DialogHeader>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => close(false)}>
                {state.options.cancelLabel ?? t('common.cancel')}
              </Button>
              <Button
                variant={variant}
                onClick={() => close(true)}
                autoFocus
              >
                {state.options.confirmLabel ?? t('common.confirm')}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </ConfirmContext.Provider>
  )
}
