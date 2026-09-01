import { createContext, useContext } from 'react'

export interface FieldContextValue {
  id?: string
  hintId?: string
  errorId?: string
  invalid?: boolean
  required?: boolean
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function useField(): FieldContextValue | null {
  return useContext(FieldContext)
}

export function mergeAriaDescribedBy(
  own: string | undefined,
  field: FieldContextValue | null,
) {
  const ids = [own, field?.hintId, field?.errorId].filter(Boolean) as string[]
  return ids.length > 0 ? ids.join(' ') : undefined
}
