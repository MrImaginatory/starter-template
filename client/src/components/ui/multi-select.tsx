import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'
import { mergeAriaDescribedBy, useField } from './field-context'
import { Button } from './button'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value: string[]
  onValueChange: (value: string[]) => void
  placeholder?: string
  searchable?: boolean
  disabled?: boolean
  invalid?: boolean
  maxVisibleChips?: number
  className?: string
  id?: string
}

export function MultiSelect({
  options,
  value,
  onValueChange,
  searchable = true,
  disabled,
  invalid: invalidProp,
  maxVisibleChips = 4,
  className,
  id: idProp,
}: MultiSelectProps) {
  const { t } = useTranslation()
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const describedBy = mergeAriaDescribedBy(undefined, field)

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options
    return options.filter((option) => option.label.toLowerCase().includes(q))
  }, [options, query])

  const selectedOptions = value
    .map((v) => options.find((option) => option.value === v))
    .filter((option): option is MultiSelectOption => Boolean(option))
  const visibleChips = selectedOptions.slice(0, maxVisibleChips)
  const hiddenCount = selectedOptions.length - visibleChips.length

  const toggle = (optionValue: string) => {
    onValueChange(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue],
    )
  }

  const handleListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [],
    )
    if (buttons.length === 0) return
    const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement)
    const nextIndex =
      event.key === 'ArrowDown'
        ? (currentIndex + 1 + buttons.length) % buttons.length
        : (currentIndex - 1 + buttons.length) % buttons.length
    buttons[nextIndex].focus()
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) setQuery('') }}>
      <PopoverPrimitive.Trigger
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn(
          'flex min-h-10 w-full cursor-pointer flex-wrap items-center gap-1.5 rounded-lg border border-input bg-surface px-3 py-1.5 text-left text-sm shadow-xs outline-none transition-[border-color,box-shadow] duration-150',
          'hover:border-border-strong focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
          'disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60',
          invalid && 'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20',
          className,
        )}
      >
        <span className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
          {selectedOptions.length === 0 && (
            <span className="text-fg-subtle">{t('multiSelect.placeholder')}</span>
          )}
          {visibleChips.map((option) => (
            <span
              key={option.value}
              className="inline-flex max-w-full items-center gap-1 rounded-full bg-primary-soft py-0.5 pr-1 pl-2.5 text-xs font-medium text-primary-text"
            >
              <span className="truncate">{option.label}</span>
              <button
                type="button"
                disabled={disabled}
                aria-label={t('multiSelect.removeOption', { label: option.label })}
                onClick={(event) => {
                  event.stopPropagation()
                  toggle(option.value)
                }}
                className="rounded-full p-0.5 transition-colors hover:bg-primary-soft-hover focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <X className="size-3" aria-hidden="true" />
              </button>
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-fg-muted">
              +{hiddenCount}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn('size-4 shrink-0 text-fg-subtle transition-transform duration-200', open && 'rotate-180')}
        />
      </PopoverPrimitive.Trigger>

      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          style={{ width: 'var(--radix-popover-trigger-width)', maxWidth: 'var(--radix-popover-trigger-width)' }}
          className="z-50 origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-surface p-2 shadow-lg outline-none data-[state=open]:animate-zoom-in data-[state=closed]:animate-fade-out"
        >
          {searchable && (
            <div className="relative mb-2">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-fg-subtle"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t('multiSelect.search')}
                className="h-8 w-full rounded-md border border-input bg-surface pr-2.5 pl-8 text-sm text-fg outline-none transition-[border-color,box-shadow] placeholder:text-fg-subtle focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25"
              />
            </div>
          )}

          <div
            ref={listRef}
            role="listbox"
            aria-multiselectable="true"
            aria-label={t('multiSelect.placeholder')}
            onKeyDown={handleListKeyDown}
            className="grid max-h-64 gap-0.5 overflow-y-auto"
          >
            {filtered.length === 0 && (
              <p className="py-6 text-center text-sm text-fg-subtle">{t('multiSelect.noResults')}</p>
            )}
            {filtered.map((option) => {
              const selected = value.includes(option.value)
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  disabled={option.disabled}
                  onClick={() => toggle(option.value)}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm text-fg outline-none transition-colors duration-100 focus-visible:ring-2 focus-visible:ring-ring/60',
                    !option.disabled && 'hover:bg-fill-hover',
                    option.disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-4.5 shrink-0 items-center justify-center rounded-sm border shadow-xs transition-colors duration-100',
                      selected ? 'border-primary bg-primary text-primary-fg' : 'border-input bg-surface',
                    )}
                  >
                    {selected && <Check className="size-3 animate-zoom-in" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                </button>
              )
            })}
          </div>

          {selectedOptions.length > 0 && (
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-xs text-fg-muted">
                {t('multiSelect.selectedCount', { count: selectedOptions.length })}
              </span>
              <Button variant="ghost" size="xs" onClick={() => onValueChange([])}>
                {t('multiSelect.clearAll')}
              </Button>
            </div>
          )}
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
