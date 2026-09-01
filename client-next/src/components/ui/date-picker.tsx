'use client'
import { useId, useMemo, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLocale, useTranslation } from '@/lib/i18n'
import { formatDate, isSameDay, toISODate } from '@/lib/format'
import { Button } from './button'
import { mergeAriaDescribedBy, useField } from './field-context'

export interface DatePickerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange'> {
  value: Date | null
  onChange: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  isDateDisabled?: (date: Date) => boolean
  placeholder?: string
  invalid?: boolean
}

const WEEKDAY_REFERENCE = [1, 2, 3, 4, 5, 6, 7].map((day) => new Date(2024, 11, day))

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function buildCalendarCells(viewMonth: Date): { date: Date; outside: boolean }[] {
  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cellsCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7

  return Array.from({ length: cellsCount }, (_, i) => {
    const dayNumber = i - firstWeekday + 1
    return {
      date: new Date(year, month, dayNumber),
      outside: dayNumber < 1 || dayNumber > daysInMonth,
    }
  })
}

export function DatePicker({
  value,
  onChange,
  minDate,
  maxDate,
  isDateDisabled,
  placeholder = 'Pick a date',
  invalid: invalidProp,
  className,
  id: idProp,
  disabled,
  ...props
}: DatePickerProps) {
  const autoId = useId()
  const field = useField()
  const { t } = useTranslation()
  const locale = getLocale()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const describedBy = mergeAriaDescribedBy(props['aria-describedby'], field)

  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState<Date>(() => startOfMonth(value ?? new Date()))

  const cells = useMemo(() => buildCalendarCells(viewMonth), [viewMonth])
  const weekdayLabels = useMemo(
    () =>
      WEEKDAY_REFERENCE.map((day) =>
        new Intl.DateTimeFormat(locale, { weekday: 'short' })
          .format(day)
          .slice(0, 2),
      ),
    [locale],
  )

  const isDisabled = (date: Date) => {
    if (minDate && date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()))
      return true
    if (maxDate && date > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()))
      return true
    return isDateDisabled?.(date) ?? false
  }

  const prevDisabled =
    !!minDate && viewMonth <= startOfMonth(new Date(minDate.getFullYear(), minDate.getMonth() + 1, 0))
  const nextDisabled = !!maxDate && viewMonth >= startOfMonth(maxDate)

  const today = new Date()

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        id={id}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-input bg-surface px-3 text-left text-sm shadow-xs outline-none transition-[border-color,box-shadow] duration-150',
          'hover:border-border-strong focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
          'disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60',
          invalid && 'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20',
          !value && 'font-normal text-fg-subtle',
          className,
        )}
        {...props}
      >
        <span>{value ? formatDate(value) : placeholder}</span>
        <CalendarIcon aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 w-auto origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-surface p-3 shadow-lg outline-none data-[state=open]:animate-zoom-in data-[state=closed]:animate-fade-out"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              aria-label={t('datePicker.previousMonth')}
              disabled={prevDisabled}
              onClick={() =>
                setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))
              }
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-muted outline-none transition-colors hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-semibold text-fg" aria-live="polite">
              {formatDate(viewMonth, locale, { month: 'long', year: 'numeric' })}
            </span>
            <button
              type="button"
              aria-label={t('datePicker.nextMonth')}
              disabled={nextDisabled}
              onClick={() =>
                setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))
              }
              className="inline-flex size-8 cursor-pointer items-center justify-center rounded-md text-fg-muted outline-none transition-colors hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>

          <div role="group" aria-label={t('datePicker.calendar')} className="grid w-64 grid-cols-7 gap-y-0.5">
            {weekdayLabels.map((label, index) => (
              <span
                key={`${label}-${index}`}
                aria-hidden="true"
                className="grid size-8 place-items-center text-xs font-medium text-fg-subtle"
              >
                {label}
              </span>
            ))}
            {cells.map(({ date, outside }) => {
              const selected = value ? isSameDay(date, value) : false
              const isToday = isSameDay(date, today)
              const cellDisabled = outside || isDisabled(date)
              return (
                <button
                  key={toISODate(date)}
                  type="button"
                  disabled={cellDisabled}
                  aria-label={formatDate(date, locale, { dateStyle: 'full' })}
                  onClick={() => {
                    if (!outside) onChange(date)
                  }}
                  className={cn(
                    'grid size-8 place-items-center rounded-md text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/60 [&:not(:disabled)]:cursor-pointer',
                    outside ? 'text-fg-subtle opacity-40' : 'text-fg',
                    !cellDisabled && !selected && 'hover:bg-fill-hover',
                    isToday && !selected && 'font-semibold text-primary-text ring-1 ring-primary/40 ring-inset',
                    selected && 'bg-primary font-semibold text-primary-fg shadow-xs',
                    cellDisabled && 'cursor-default opacity-30 hover:bg-transparent',
                  )}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <Button variant="ghost" size="xs" onClick={() => { onChange(today); setOpen(false) }}>
              {t('common.today')}
            </Button>
            <Button variant="ghost" size="xs" onClick={() => { onChange(null); setOpen(false) }}>
              {t('common.clear')}
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
