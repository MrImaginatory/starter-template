import { useId } from 'react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { mergeAriaDescribedBy, useField } from './field-context'

const textareaSizes = {
  sm: 'min-h-16 px-2.5 py-1.5 text-xs',
  md: 'min-h-20 px-3 py-2 text-sm',
  lg: 'min-h-24 px-3.5 py-2.5 text-base',
} as const

export interface TextareaProps extends Omit<ComponentProps<'textarea'>, 'size'> {
  size?: keyof typeof textareaSizes
  invalid?: boolean
}

export function Textarea({
  size = 'md',
  invalid: invalidProp,
  className,
  ref,
  id: idProp,
  required: requiredProp,
  'aria-describedby': describedByProp,
  ...props
}: TextareaProps) {
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const required = requiredProp ?? field?.required
  const describedBy = mergeAriaDescribedBy(describedByProp, field)

  return (
    <textarea
      ref={ref}
      id={id}
      required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(
        'w-full resize-y border border-input bg-surface text-fg shadow-xs outline-none transition-[border-color,box-shadow] duration-150',
        'placeholder:text-fg-subtle hover:border-border-strong',
        'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
        'disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60',
        'read-only:bg-muted/40',
        invalid &&
          'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20',
        textareaSizes[size],
        className,
      )}
      {...props}
    />
  )
}
