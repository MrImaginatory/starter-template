'use client'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/lib/i18n'

export interface TimeColumnsProps {
  value: Date | null
  onChange: (date: Date) => void
  /** Render 12-hour columns with an AM/PM toggle (default `true`). */
  hour12?: boolean
  /** Minute step, 1–59 (default `1`). */
  minuteInterval?: number
  className?: string
}

interface TimeColumnOption {
  value: number
  label: string
}

interface WheelColumnProps {
  label: string
  options: TimeColumnOption[]
  selected: number
  onSelect: (value: number) => void
}

/** How many rows are visible around the selected value (selected stays centered). */
const WINDOW_SIZE = 7

/** Scroll distance (px) that maps to one step while wheeling over a track. */
const WHEEL_STEP_PX = 40

/**
 * Wheel-style column: a fixed window of values with chevron buttons above and
 * below — no scrolling, no scrollbars. Wraps around at both ends.
 */
function WheelColumn({ label, options, selected, onSelect }: WheelColumnProps) {
  const { t } = useTranslation()
  const listRef = useRef<HTMLDivElement>(null)
  const length = options.length
  const selectedIndex = Math.max(
    options.findIndex((option) => option.value === selected),
    0,
  )
  const windowSize = Math.min(WINDOW_SIZE, length)
  const center = Math.floor(windowSize / 2)
  const start = (((selectedIndex - center) % length) + length) % length
  const visible = Array.from(
    { length: windowSize },
    (_, i) => options[(start + i) % length],
  )

  const step = (delta: 1 | -1) => {
    const next = options[(((selectedIndex + delta) % length) + length) % length]
    onSelect(next.value)
  }

  // Wheel over the track steps the value — scrollable feel, no scrollbars.
  // Native listener: React's root `wheel` is passive, so it can't preventDefault.
  const stepRef = useRef(step)
  useEffect(() => {
    stepRef.current = step
  })
  useEffect(() => {
    const node = listRef.current
    if (!node) return
    let accumulated = 0
    const onWheel = (event: globalThis.WheelEvent) => {
      event.preventDefault()
      // Firefox sends line-mode deltas (deltaMode 1); normalize to pixels.
      const deltaY = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY
      accumulated += deltaY
      if (Math.abs(accumulated) < WHEEL_STEP_PX) return
      const delta = accumulated > 0 ? 1 : -1
      accumulated = 0
      stepRef.current(delta)
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp') event.preventDefault()
    else if (event.key === 'ArrowDown') event.preventDefault()
    else return
    const delta = event.key === 'ArrowUp' ? 1 : -1
    const nextIndex = (((selectedIndex + delta) % length) + length) % length
    onSelect(options[nextIndex].value)
    requestAnimationFrame(() => {
      listRef.current
        ?.querySelector<HTMLButtonElement>(`[data-value="${options[nextIndex].value}"]`)
        ?.focus({ preventScroll: true })
    })
  }

  // Buttons share the track's full width and sit flush against it — one unit.
  const chevronClass =
    'grid h-7 w-full shrink-0 cursor-pointer place-items-center bg-surface text-fg-muted outline-none transition-colors hover:bg-fill-hover hover:text-fg focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset'

  return (
    <div className="flex w-16 flex-col overflow-hidden rounded-lg border border-border bg-fill/40 shadow-xs">
      <button
        type="button"
        aria-label={t('timePicker.increase', { label })}
        onClick={() => step(1)}
        className={cn(chevronClass, 'border-b border-border')}
      >
        <ChevronUp className="size-4" aria-hidden="true" />
      </button>

      <div
        ref={listRef}
        role="listbox"
        aria-label={label}
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        className="w-full"
      >
        {visible.map((option) => {
          const isSelected = option.value === selected
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              data-value={option.value}
              aria-selected={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(option.value)}
              className={cn(
                'block h-8 w-full cursor-pointer select-none text-center text-sm leading-8 tabular-nums outline-none transition-colors duration-100',
                'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset',
                isSelected
                  ? 'bg-primary font-semibold text-primary-fg'
                  : 'text-fg hover:bg-fill-hover',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        aria-label={t('timePicker.decrease', { label })}
        onClick={() => step(-1)}
        className={cn(chevronClass, 'border-t border-border')}
      >
        <ChevronDown className="size-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function buildHours(hour12: boolean): TimeColumnOption[] {
  if (hour12) {
    return Array.from({ length: 12 }, (_, i) => {
      const hour = i + 1
      return { value: hour, label: String(hour) }
    })
  }
  return Array.from({ length: 24 }, (_, hour) => ({
    value: hour,
    label: String(hour).padStart(2, '0'),
  }))
}

function buildMinutes(minuteInterval: number): TimeColumnOption[] {
  const step = Math.min(Math.max(Math.floor(minuteInterval), 1), 59)
  const minutes: TimeColumnOption[] = []
  for (let minute = 0; minute < 60; minute += step) {
    minutes.push({ value: minute, label: String(minute).padStart(2, '0') })
  }
  return minutes
}

/**
 * Wheel-style hour / minute (and AM/PM) columns — button-driven, no scrolling.
 * Emits a full `Date` built from the current value (or today when `value` is null).
 */
export function TimeColumns({
  value,
  onChange,
  hour12 = true,
  minuteInterval = 1,
  className,
}: TimeColumnsProps) {
  const { t } = useTranslation()
  const base = value ?? new Date()

  const commit = (hours: number, minutes: number) => {
    const next = new Date(base)
    next.setHours(hours, minutes, 0, 0)
    onChange(next)
  }

  const period = base.getHours() >= 12 ? 1 : 0
  const current24 = base.getHours()
  const selectedHour = hour12 ? ((current24 % 12) || 12) : current24
  const selectedMinute = base.getMinutes()

  const hours = buildHours(hour12)
  const minutes = buildMinutes(minuteInterval)
  const periods: TimeColumnOption[] = [
    { value: 0, label: 'AM' },
    { value: 1, label: 'PM' },
  ]

  return (
    <div className={cn('flex items-center justify-center gap-3', className)}>
      <WheelColumn
        label={t('timePicker.hour')}
        options={hours}
        selected={selectedHour}
        onSelect={(hour) => {
          const normalized = hour12 ? (hour % 12) + period * 12 : hour
          commit(normalized, selectedMinute)
        }}
      />
      <WheelColumn
        label={t('timePicker.minute')}
        options={minutes}
        selected={selectedMinute}
        onSelect={(minute) => commit(current24, minute)}
      />
      {hour12 && (
        <WheelColumn
          label={t('timePicker.period')}
          options={periods}
          selected={period}
          onSelect={(nextPeriod) => {
            const hours24 = (current24 % 12) + nextPeriod * 12
            commit(hours24, selectedMinute)
          }}
        />
      )}
    </div>
  )
}
