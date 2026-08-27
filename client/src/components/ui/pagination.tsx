import type { ComponentProps } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

type PageItem = number | 'ellipsis-left' | 'ellipsis-right'

function buildPageItems(page: number, totalPages: number, siblingCount: number): PageItem[] {
  const totalNumbers = siblingCount * 2 + 5
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const left = Math.max(2, page - siblingCount)
  const right = Math.min(totalPages - 1, page + siblingCount)
  const items: PageItem[] = [1]

  if (left > 2) items.push(left === 3 ? 2 : 'ellipsis-left')
  for (let i = left; i <= right; i++) {
    if (i > 1 && i < totalPages) items.push(i)
  }
  if (right < totalPages - 1) items.push(right === totalPages - 2 ? totalPages - 1 : 'ellipsis-right')

  items.push(totalPages)
  return items
}

const pageButtonBase =
  'inline-flex size-8 cursor-pointer select-none items-center justify-center rounded-md text-sm font-medium outline-none transition-[background-color,color] duration-100 focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50'

export interface PaginationProps extends Omit<ComponentProps<'nav'>, 'onChange'> {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  siblingCount?: number
  showSummary?: boolean
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showSummary = true,
  className,
  ...props
}: PaginationProps) {
  const { t } = useTranslation()
  const items = buildPageItems(page, totalPages, siblingCount)

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex flex-wrap items-center justify-center gap-x-3 gap-y-2', className)}
      {...props}
    >
      {showSummary && (
        <span aria-live="polite" className="order-first w-full text-center text-sm text-fg-muted sm:order-none sm:w-auto">
          {t('pagination.summary', { page, total: totalPages })}
        </span>
      )}

      <button
        type="button"
        aria-label={t('pagination.previous')}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(pageButtonBase, 'text-fg-muted hover:bg-fill-hover hover:text-fg')}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </button>

      <ul className="flex items-center gap-1">
        {items.map((item) =>
          typeof item === 'number' ? (
            <li key={item} className="hidden sm:block">
              <button
                type="button"
                aria-current={item === page ? 'page' : undefined}
                onClick={() => item !== page && onPageChange(item)}
                className={cn(
                  pageButtonBase,
                  item === page
                    ? 'pointer-events-none bg-primary text-primary-fg shadow-xs'
                    : 'text-fg-muted hover:bg-fill-hover hover:text-fg',
                )}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className="hidden sm:flex size-8 items-center justify-center text-fg-subtle">
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        aria-label={t('pagination.next')}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className={cn(pageButtonBase, 'text-fg-muted hover:bg-fill-hover hover:text-fg')}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
