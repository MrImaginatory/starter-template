'use client'
import type { ComponentProps } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/lib/utils'

export const TooltipProvider = TooltipPrimitive.Provider

export interface TooltipProps extends ComponentProps<typeof TooltipPrimitive.Tooltip> {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
}

export function Tooltip({
  content,
  side = 'top',
  align = 'center',
  children,
  open,
  defaultOpen,
  onOpenChange,
}: TooltipProps) {
  return (
    <TooltipProvider delayDuration={200} skipDelayDuration={300}>
      <TooltipPrimitive.Root open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            align={align}
            sideOffset={6}
            className={cn(
              'z-50 max-w-64 origin-(--radix-tooltip-content-transform-origin) rounded-lg bg-fg px-2.5 py-1.5 text-xs font-medium text-background shadow-md select-none',
              'data-[state=delayed-open]:animate-zoom-in data-[state=closed]:animate-fade-out',
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-fg" width={10} height={5} />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipProvider>
  )
}
