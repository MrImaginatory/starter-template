import type { ComponentProps, ReactNode } from 'react'
import { ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Breadcrumb({ className, ...props }: ComponentProps<'nav'>) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)} {...props} />
  )
}

export function BreadcrumbList({ className, ...props }: ComponentProps<'ol'>) {
  return (
    <ol
      className={cn(
        'flex flex-wrap items-center gap-1.5 break-words text-sm text-fg-muted',
        className,
      )}
      {...props}
    />
  )
}

export function BreadcrumbItem({ className, ...props }: ComponentProps<'li'>) {
  return <li className={cn('inline-flex items-center gap-1.5', className)} {...props} />
}

export function BreadcrumbLink({
  className,
  ...props
}: ComponentProps<'a'>) {
  return (
    <a
      className={cn(
        'rounded-sm font-medium transition-colors outline-none hover:text-fg focus-visible:ring-2 focus-visible:ring-ring/60',
        className,
      )}
      {...props}
    />
  )
}

export function BreadcrumbPage({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-current="page"
      role="link"
      aria-disabled="true"
      className={cn('font-semibold text-fg', className)}
      {...props}
    />
  )
}

export function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<'li'> & { children?: ReactNode }) {
  return (
    <li
      role="presentation"
      aria-hidden="true"
      className={cn('text-fg-subtle [&_svg]:size-3.5', className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

export function BreadcrumbEllipsis({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      role="presentation"
      aria-hidden="true"
      className={cn('flex size-5 items-center justify-center text-fg-subtle', className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
    </span>
  )
}
