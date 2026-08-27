import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends Omit<ComponentProps<'div'>, 'value'> {
  value?: number
  max?: number
  indeterminate?: boolean
}

export function Progress({
  value = 0,
  max = 100,
  indeterminate = false,
  className,
  ...props
}: ProgressProps) {
  const clamped = Math.min(Math.max(value, 0), max)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn('h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full rounded-full bg-primary',
          indeterminate ? 'w-1/3 animate-indeterminate' : 'transition-[width] duration-300',
        )}
        style={indeterminate ? undefined : { width: `${(clamped / max) * 100}%` }}
      />
    </div>
  )
}
