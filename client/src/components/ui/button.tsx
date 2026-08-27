import type { ComponentProps } from 'react'
import { Spinner } from './spinner'
import { buttonVariants, type ButtonSize, type ButtonVariant } from './button-variants'

export interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className,
  children,
  ref,
  type = 'button',
  ...props
}: ButtonProps) {
  const spinnerSize = size === 'xs' || size === 'sm' || size === 'icon-xs' ? 'xs' : size === 'lg' || size === 'icon-lg' ? 'lg' : 'md'
  return (
    <button
      ref={ref}
      type={type}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && <Spinner size={spinnerSize} />}
      {children}
    </button>
  )
}
