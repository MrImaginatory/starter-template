'use client'
import type { ComponentProps } from 'react'
import { useId, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { CircleAlert } from 'lucide-react'
import { FieldContext } from './field-context'

export interface FieldProps extends Omit<ComponentProps<'div'>, 'id'> {
  id?: string
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
}

export function Field({
  id: idProp,
  label,
  hint,
  error,
  required,
  className,
  children,
  ...props
}: FieldProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...props}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
          {required && (
            <span aria-hidden="true" className="ml-0.5 text-danger-text">
              *
            </span>
          )}
        </label>
      )}
      <FieldContext.Provider value={{ id, hintId, errorId, invalid: Boolean(error), required }}>
        {children}
      </FieldContext.Provider>
      {error ? (
        <p id={errorId} role="alert" className="flex items-center gap-1 text-xs font-medium text-danger-text">
          <CircleAlert className="size-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

export function Label({ className, ...props }: ComponentProps<'label'>) {
  return <label className={cn('block text-sm font-medium text-fg', className)} {...props} />
}
