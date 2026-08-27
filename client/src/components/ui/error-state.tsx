import { RotateCw, TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

export interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Try again',
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-danger-soft-border bg-danger-soft px-6 py-12 text-center',
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-xl bg-surface text-danger-text shadow-xs">
        <TriangleAlert className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-fg">{title}</h3>
        <p className="mx-auto max-w-sm text-sm text-fg-muted">{description}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RotateCw aria-hidden="true" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
