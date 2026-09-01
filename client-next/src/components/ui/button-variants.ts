import { cn } from '@/lib/utils'

export const buttonVariantsMap = {
  primary: 'bg-primary text-primary-fg shadow-xs hover:bg-primary-hover active:bg-primary-active',
  secondary: 'border border-transparent bg-muted text-fg hover:bg-muted-hover active:bg-fill-hover',
  outline:
    'border border-input bg-surface text-fg hover:border-border-strong hover:bg-fill-hover active:bg-fill-active',
  ghost: 'text-fg hover:bg-fill-hover active:bg-fill-active',
  soft: 'bg-primary-soft text-primary-text hover:bg-primary-soft-hover',
  danger: 'bg-danger text-danger-contrast shadow-xs hover:bg-danger-hover',
  'danger-ghost': 'text-danger-text hover:bg-danger-soft',
  link: 'px-0 text-primary-text underline-offset-4 hover:underline',
} as const

export const buttonSizesMap = {
  xs: 'h-7 gap-1 rounded-md px-2.5 text-xs',
  sm: 'h-8 gap-1.5 rounded-md px-3 text-sm',
  md: 'h-10 gap-2 rounded-lg px-4 text-sm',
  lg: 'h-11 gap-2 rounded-lg px-6 text-base',
  'icon-xs': 'size-7 rounded-md',
  'icon-sm': 'size-8 rounded-md',
  icon: 'size-10 rounded-lg',
  'icon-lg': 'size-11 rounded-lg',
} as const

export type ButtonVariant = keyof typeof buttonVariantsMap
export type ButtonSize = keyof typeof buttonSizesMap

const buttonBase =
  'inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-medium outline-none transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0'

export function buttonVariants({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
} = {}) {
  return cn(buttonBase, buttonSizesMap[size], buttonVariantsMap[variant], className)
}
