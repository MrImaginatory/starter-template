import { useId, useState } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'
import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLocale, useTranslation } from '@/lib/i18n'
import { formatTime } from '@/lib/format'
import { Button } from './button'
import { TimeColumns } from './time-columns'
import { mergeAriaDescribedBy, useField } from './field-context'

export interface TimePickerProps
  extends Omit<ComponentPropsWithoutRef<'button'>, 'value' | 'onChange'> {
  value: Date | null
  onChange: (date: Date | null) => void
  /** Render 12-hour format with an AM/PM column (default `true`). */
  hour12?: boolean
  /** Minute step, 1–59 (default `1`). */
  minuteInterval?: number
  placeholder?: string
  invalid?: boolean
}

export function TimePicker({
  value,
  onChange,
  hour12 = true,
  minuteInterval = 1,
  placeholder = 'Pick a time',
  invalid: invalidProp,
  className,
  id: idProp,
  disabled,
  ...props
}: TimePickerProps) {
  const autoId = useId()
  const field = useField()
  const { t } = useTranslation()
  const locale = getLocale()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const describedBy = mergeAriaDescribedBy(props['aria-describedby'], field)

  const [open, setOpen] = useState(false)

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
        <span>{value ? formatTime(value, locale, hour12) : placeholder}</span>
        <Clock aria-hidden="true" className="size-4 shrink-0 text-fg-subtle" />
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={6}
          className="z-50 origin-(--radix-popover-content-transform-origin) rounded-xl border border-border bg-surface p-3 shadow-lg outline-none data-[state=open]:animate-zoom-in data-[state=closed]:animate-fade-out"
        >
          <TimeColumns
            value={value}
            onChange={onChange}
            hour12={hour12}
            minuteInterval={minuteInterval}
            className="mb-3"
          />
          <div className="flex items-center justify-between border-t border-border pt-3">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onChange(new Date())
                setOpen(false)
              }}
            >
              {t('timePicker.now')}
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onChange(null)
                setOpen(false)
              }}
            >
              {t('common.clear')}
            </Button>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}
