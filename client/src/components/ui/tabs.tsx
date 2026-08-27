import { createContext, useContext, type ComponentProps } from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

type TabsVariant = 'underline' | 'pills'

const TabsVariantContext = createContext<TabsVariant>('underline')

export interface TabsProps extends ComponentProps<typeof TabsPrimitive.Root> {
  variant?: TabsVariant
}

export function Tabs({ variant = 'underline', className, ...props }: TabsProps) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.Root className={cn('flex flex-col gap-3', className)} {...props} />
    </TabsVariantContext.Provider>
  )
}

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  const variant = useContext(TabsVariantContext)
  return (
    <TabsPrimitive.List
      className={cn(
        variant === 'pills'
          ? 'inline-flex w-fit items-center gap-1 self-start overflow-x-auto rounded-xl bg-muted p-1'
          : '-mb-px flex items-center gap-1 overflow-x-auto border-b border-border',
        className,
      )}
      {...props}
    />
  )
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  const variant = useContext(TabsVariantContext)
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center gap-2 font-medium whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
        variant === 'pills'
          ? 'rounded-lg px-3.5 py-1.5 text-sm text-fg-muted hover:text-fg data-[state=active]:bg-surface data-[state=active]:text-fg data-[state=active]:shadow-xs'
          : 'relative rounded-t-lg px-3 py-2 text-sm text-fg-muted after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-transparent after:transition-colors hover:text-fg data-[state=active]:text-primary-text data-[state=active]:after:bg-primary',
        className,
      )}
      {...props}
    />
  )
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
        'data-[state=active]:animate-slide-up-fade',
        className,
      )}
      {...props}
    />
  )
}
