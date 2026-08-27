import { useId } from 'react'
import type { ComponentProps } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { mergeAriaDescribedBy, useField } from './field-context'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectGroup = SelectPrimitive.Group

export interface SelectTriggerProps
  extends ComponentProps<typeof SelectPrimitive.Trigger> {
  size?: 'sm' | 'md' | 'lg'
  invalid?: boolean
}

const triggerSizes = {
  sm: 'h-8 rounded-md px-2.5 text-xs gap-1',
  md: 'h-10 rounded-lg px-3 text-sm gap-2',
  lg: 'h-11 rounded-lg px-3.5 text-base gap-2',
} as const

export function SelectTrigger({
  size = 'md',
  invalid: invalidProp,
  className,
  children,
  id: idProp,
  'aria-describedby': describedByProp,
  ...props
}: SelectTriggerProps) {
  const autoId = useId()
  const field = useField()
  const id = idProp ?? field?.id ?? autoId
  const invalid = invalidProp ?? field?.invalid ?? false
  const describedBy = mergeAriaDescribedBy(describedByProp, field)

  return (
    <SelectPrimitive.Trigger
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      className={cn(
        'flex w-full items-center justify-between gap-2 border border-input bg-surface text-left text-fg shadow-xs outline-none transition-[border-color,box-shadow] duration-150',
        'data-[placeholder]:text-fg-subtle hover:border-border-strong',
        'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25',
        'disabled:cursor-not-allowed disabled:bg-muted/50 disabled:opacity-60',
        '[&_svg]:pointer-events-none [&_svg]:shrink-0',
        invalid &&
          'border-danger hover:border-danger focus-visible:border-danger focus-visible:ring-danger/20',
        triggerSizes[size],
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 text-fg-subtle" aria-hidden="true" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

export function SelectContent({
  className,
  children,
  position = 'popper',
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={6}
        className={cn(
          'relative z-50 max-h-(--radix-select-content-available-height) min-w-(--radix-select-trigger-width) origin-(--radix-select-content-transform-origin) overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
          'data-[state=open]:animate-zoom-in data-[state=closed]:animate-zoom-out',
          position === 'popper' &&
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1',
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn('p-1.5', position === 'popper' && 'w-full min-w-(--radix-select-trigger-width)')}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

export function SelectItem({ className, children, ...props }: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-lg py-1.5 pr-8 pl-2.5 text-sm text-fg outline-none transition-colors duration-100',
        'data-[highlighted]:bg-fill-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2.5 flex items-center justify-center">
        <Check className="size-4 text-primary" aria-hidden="true" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export function SelectLabel({ className, ...props }: ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      className={cn('px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle', className)}
      {...props}
    />
  )
}

export function SelectSeparator({
  className,
  ...props
}: ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator className={cn('-mx-1.5 my-1.5 h-px bg-border', className)} {...props} />
  )
}
