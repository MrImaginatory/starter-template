import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-strong bg-surface px-6 py-12 text-center',
        className,
      )}
    >
      {Icon && (
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-fg-subtle">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      )}
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-fg-muted">{description}</p>
        )}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
