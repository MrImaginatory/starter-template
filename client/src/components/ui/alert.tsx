import type { ComponentProps, ReactNode } from 'react'
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = {
  info: 'border-info-soft-border bg-info-soft text-info-text',
  success: 'border-success-soft-border bg-success-soft text-success-text',
  warning: 'border-warning-soft-border bg-warning-soft text-warning-text',
  danger: 'border-danger-soft-border bg-danger-soft text-danger-text',
} as const

export type AlertVariant = keyof typeof alertVariants

const alertIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
} as const

export interface AlertProps extends Omit<ComponentProps<'div'>, 'title'> {
  variant?: AlertVariant
  icon?: ReactNode
  onClose?: () => void
}

export function Alert({
  variant = 'info',
  icon,
  onClose,
  className,
  children,
  ...props
}: AlertProps) {
  const Icon = alertIcons[variant]
  return (
    <div
      role="alert"
      className={cn('relative flex gap-3 rounded-xl border p-4 text-sm', alertVariants[variant], className)}
      {...props}
    >
      <span className="mt-0.5 shrink-0 [&_svg]:size-4.5">{icon ?? <Icon aria-hidden="true" />}</span>
      <div className="min-w-0 flex-1">{children}</div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="-mr-1 -mt-1 h-6 w-6 shrink-0 self-start rounded-md p-1 opacity-60 outline-none transition-[opacity,background-color] duration-100 hover:bg-black/5 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current dark:hover:bg-white/10 [&_svg]:size-3.5"
        >
          <X aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export function AlertTitle({ className, ...props }: ComponentProps<'h5'>) {
  return <h5 className={cn('font-semibold', className)} {...props} />
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mt-1 leading-relaxed opacity-90', className)} {...props} />
}
