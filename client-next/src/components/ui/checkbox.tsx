'use client'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mergeAriaDescribedBy, useField } from './field-context'

export interface CheckboxProps extends ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  label?: ReactNode
  invalid?: boolean
}

export function Checkbox({
  label,
  invalid: invalidProp,
  className,
  id: idProp,
  required: requiredProp,
  'aria-describedby': describedByProp,
  ...props
}: CheckboxProps) {
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const required = requiredProp ?? field?.required
  const describedBy = mergeAriaDescribedBy(describedByProp, field)
  const indeterminate = props.checked === 'indeterminate'

  const control = (
    <CheckboxPrimitive.Root
      id={id}
      required={required}
      aria-describedby={describedBy}
      className={cn(
        'size-5 shrink-0 cursor-pointer rounded-sm border border-input bg-surface shadow-xs outline-none transition-[background-color,border-color,box-shadow] duration-150',
        'hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-fg',
        'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-fg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid &&
          'border-danger hover:border-danger data-[state=checked]:border-danger data-[state=checked]:bg-danger',
        !label && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        {indeterminate ? (
          <Minus className="size-3.5 animate-zoom-in" strokeWidth={3} aria-hidden="true" />
        ) : (
          <Check className="size-3.5 animate-zoom-in" strokeWidth={3} aria-hidden="true" />
        )}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )

  if (!label) return control

  return (
    <span className="inline-flex items-center gap-2.5">
      {control}
      <label htmlFor={id} className="cursor-pointer select-none text-sm font-medium text-fg">
        {label}
      </label>
    </span>
  )
}
