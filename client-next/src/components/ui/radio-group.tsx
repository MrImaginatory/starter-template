'use client'
import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

export interface RadioGroupProps
  extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  invalid?: boolean
}

export function RadioGroup({ className, invalid, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root
      aria-invalid={invalid || undefined}
      className={cn(
        'flex flex-col gap-2.5 rounded-lg outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className,
      )}
      {...props}
    />
  )
}

export interface RadioProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  label?: ReactNode
  invalid?: boolean
}

export function Radio({ label, invalid, className, id: idProp, ...props }: RadioProps) {
  const autoId = useId()
  const id = idProp ?? autoId

  const control = (
    <RadioGroupPrimitive.Item
      id={id}
      className={cn(
        'size-5 shrink-0 cursor-pointer rounded-full border border-input bg-surface shadow-xs outline-none transition-[background-color,border-color,box-shadow] duration-150',
        'hover:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'data-[state=checked]:border-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        (invalid || props['aria-invalid']) && 'border-danger hover:border-danger',
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span className="size-2.5 animate-zoom-in rounded-full bg-primary" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
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
