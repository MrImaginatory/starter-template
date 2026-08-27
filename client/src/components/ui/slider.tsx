import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps
  extends Omit<ComponentProps<'input'>, 'type' | 'value' | 'onChange' | 'min' | 'max' | 'step'> {
  value: number
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number) => void
}

export function Slider({
  value,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  className,
  ...props
}: SliderProps) {
  const progress = max > min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <input
      type="range"
      role="slider"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onValueChange?.(Number(event.target.value))}
      style={{ background: `linear-gradient(to right, var(--primary) ${progress}%, var(--muted) ${progress}%)` }}
      className={cn(
        'h-1.5 w-full cursor-pointer appearance-none rounded-full outline-none',
        'focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        '[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-surface [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-transform active:[&::-webkit-slider-thumb]:scale-110',
        '[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-surface [&::-moz-range-thumb]:bg-primary',
        className,
      )}
      {...props}
    />
  )
}
