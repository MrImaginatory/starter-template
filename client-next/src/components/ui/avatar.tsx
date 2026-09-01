'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { initials } from '@/lib/string'

const avatarSizes = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
} as const

export interface AvatarProps {
  src?: string
  alt?: string
  name: string
  size?: keyof typeof avatarSizes
  className?: string
}

export function Avatar({ src, alt, name, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = src && !failed

  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full border border-border bg-primary-soft font-semibold text-primary-text uppercase',
        avatarSizes[size],
        className,
      )}
      title={alt ?? name}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt ?? name}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}
