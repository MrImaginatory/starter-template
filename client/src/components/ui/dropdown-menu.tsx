import type { ComponentProps } from 'react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { cn } from '@/lib/utils'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group

export function DropdownMenuContent({
  className,
  sideOffset = 6,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          'z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-44 origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto rounded-xl border border-border bg-surface p-1.5 shadow-lg',
          'data-[state=open]:animate-zoom-in data-[state=closed]:animate-fade-out',
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  )
}

export function DropdownMenuItem({
  className,
  destructive,
  inset,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  destructive?: boolean
  inset?: boolean
}) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        'flex cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-fg outline-none transition-colors duration-100',
        'data-[highlighted]:bg-fill-hover data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        '[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-fg-muted',
        inset && 'pl-8',
        destructive &&
          'text-danger-text [&_svg]:text-danger-text data-[highlighted]:bg-danger-soft',
        className,
      )}
      {...props}
    />
  )
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      className={cn('ml-auto pl-4 text-xs tracking-widest text-fg-subtle', className)}
      {...props}
    />
  )
}

export function DropdownMenuSeparator({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator className={cn('-mx-1.5 my-1.5 h-px bg-border', className)} {...props} />
  )
}

export function DropdownMenuLabel({
  className,
  ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label>) {
  return (
    <DropdownMenuPrimitive.Label
      className={cn('px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-fg-subtle', className)}
      {...props}
    />
  )
}
