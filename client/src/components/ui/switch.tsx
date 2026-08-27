import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'
import { mergeAriaDescribedBy, useField } from './field-context'

export interface SwitchProps extends ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  label?: ReactNode
  invalid?: boolean
}

export function Switch({
  label,
  invalid: invalidProp,
  className,
  id: idProp,
  required: requiredProp,
  'aria-describedby': describedByProp,
  ...props
}: SwitchProps) {
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const required = requiredProp ?? field?.required
  const describedBy = mergeAriaDescribedBy(describedByProp, field)

  const control = (
    <SwitchPrimitive.Root
      id={id}
      required={required}
      aria-describedby={describedBy}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-border-strong outline-none transition-colors duration-150',
        'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'data-[state=checked]:bg-primary data-[state=unchecked]:hover:bg-fill-active',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'bg-danger data-[state=checked]:bg-danger',
        !label && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 rounded-full bg-surface shadow-sm ring-1 ring-black/5 transition-transform duration-150 data-[state=checked]:translate-x-[1.25rem] data-[state=unchecked]:translate-x-0" />
    </SwitchPrimitive.Root>
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
