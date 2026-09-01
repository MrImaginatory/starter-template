import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ShowcaseSection({
  id,
  title,
  description,
  children,
}: {
  id: string
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <div className="mb-6">
        <h2 id={`${id}-heading`} className="text-h2 text-fg">
          {title}
        </h2>
        {description && <p className="mt-2 max-w-2xl text-sm text-fg-muted">{description}</p>}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

export function Demo({
  title,
  layout = 'wrap',
  className,
  children,
}: {
  title: string
  layout?: 'wrap' | 'stack' | 'grid'
  className?: string
  children: ReactNode
}) {
  const layoutClasses =
    layout === 'stack'
      ? 'flex flex-col gap-4'
      : layout === 'grid'
        ? 'grid gap-4 sm:grid-cols-2'
        : 'flex flex-wrap items-center gap-3'
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle">
        {title}
      </h3>
      <div className={cn('rounded-xl border border-border bg-surface p-5', layoutClasses, className)}>
        {children}
      </div>
    </div>
  )
}

export function TokenSwatch({
  name,
  token,
  className,
}: {
  name: string
  token: string
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        aria-hidden="true"
        className="size-9 shrink-0 rounded-lg border border-border shadow-xs"
        style={{ backgroundColor: `var(${token})` }}
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-medium text-fg">{name}</span>
        <code className="block truncate text-xs text-fg-subtle">{token}</code>
      </span>
    </div>
  )
}
