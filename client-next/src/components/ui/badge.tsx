import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const badgeVariants = {
  neutral: 'border-border bg-muted text-fg-muted',
  primary: 'border-primary-soft-border bg-primary-soft text-primary-text',
  success: 'border-success-soft-border bg-success-soft text-success-text',
  warning: 'border-warning-soft-border bg-warning-soft text-warning-text',
  danger: 'border-danger-soft-border bg-danger-soft text-danger-text',
  info: 'border-info-soft-border bg-info-soft text-info-text',
  outline: 'border-border-strong bg-transparent text-fg-muted',
} as const

export type BadgeVariant = keyof typeof badgeVariants

export interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current opacity-80" />}
      {children}
    </span>
  )
}

export function BadgeDot({ className }: { className?: string }): ReactNode {
  return <span aria-hidden="true" className={cn('size-1.5 rounded-full bg-current opacity-80', className)} />
}
