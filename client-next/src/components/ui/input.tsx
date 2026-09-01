'use client'
import { useId, type ReactNode } from 'react'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import { mergeAriaDescribedBy, useField } from './field-context'

const inputSizes = {
  sm: 'h-8 rounded-md px-2.5 text-xs',
  md: 'h-10 rounded-lg px-3 text-sm',
  lg: 'h-11 rounded-lg px-3.5 text-base',
} as const

export interface InputProps extends Omit<ComponentProps<'input'>, 'size'> {
  size?: keyof typeof inputSizes
  invalid?: boolean
  leading?: ReactNode
  trailing?: ReactNode
}

export function Input({
  size = 'md',
  invalid: invalidProp,
  leading,
  trailing,
  className,
  ref,
  id: idProp,
  required: requiredProp,
  'aria-describedby': describedByProp,
  ...props
}: InputProps) {
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const required = requiredProp ?? field?.required
  const describedBy = mergeAriaDescribedBy(describedByProp, field)

  const input = (
    <input
      ref={ref}
      id={id}
      required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(
        'w-full border border-input bg-surface text-fg shadow-xs outline-none transition-[border-color,box-shadow] duration-150',
        'placeholder:text-fg-subtle hover:border-border-strong',
        'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
        'disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60',
        'read-only:bg-muted/40',
        'file:mr-3 file:h-full file:cursor-pointer file:rounded-md file:border-0 file:bg-muted file:px-3 file:text-sm file:font-medium file:hover:bg-muted-hover',
        invalid &&
          'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20',
        inputSizes[size],
        leading && 'pl-9',
        trailing && 'pr-9',
        className,
      )}
      {...props}
    />
  )

  if (!leading && !trailing) return input

  return (
    <div className="relative w-full">
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-fg-subtle [&_svg]:size-4">
          {leading}
        </span>
      )}
      {input}
      {trailing && (
        <span className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-fg-subtle [&_svg]:size-4">
          {trailing}
        </span>
      )}
    </div>
  )
}
