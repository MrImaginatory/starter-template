import { useCallback, useEffect, useRef, useState } from 'react'
import { useDropzone, type Accept, type FileRejection } from 'react-dropzone'
import { FileText, Upload as UploadIcon, X, AlertCircle, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface UploadProps {
  accept?: Accept
  maxFiles?: number
  maxSize?: number
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
  label?: string
  hint?: string
  className?: string
}

const DEFAULT_ACCEPT: Accept = {
  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
  'application/pdf': ['.pdf'],
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return null
  return <FileText className="size-4 shrink-0 text-fg-muted" aria-hidden="true" />
}

export function Upload({
  accept = DEFAULT_ACCEPT,
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  onFilesSelected,
  disabled = false,
  label = 'Drag & drop files here',
  hint,
  className,
}: UploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [rejections, setRejections] = useState<FileRejection[]>([])
  const [previews, setPreviews] = useState<Map<string, string>>(new Map())
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const previewUrls = useRef<Map<string, string>>(new Map())

  const cleanupPreviews = useCallback(() => {
    previewUrls.current.forEach((url) => URL.revokeObjectURL(url))
    previewUrls.current.clear()
  }, [])

  useEffect(() => cleanupPreviews, [cleanupPreviews])

  const lastDropRef = useRef(0)

  const onDrop = useCallback(
    (accepted: File[]) => {
      const now = Date.now()
      if (now - lastDropRef.current < 300) return
      lastDropRef.current = now

      setRejections([])
      setFiles((prev) => [...prev, ...accepted].slice(0, maxFiles))

      accepted.forEach((file) => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file)
          previewUrls.current.set(file.name, url)
          setPreviews((prev) => new Map(prev).set(file.name, url))
        }
      })

      onFilesSelected(accepted)
    },
    [maxFiles, onFilesSelected],
  )

  const onDropRejected = useCallback((rejected: FileRejection[]) => {
    setRejections(rejected)
  }, [])

  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const file = prev[index]
        if (file) {
          const url = previewUrls.current.get(file.name)
          if (url) {
            URL.revokeObjectURL(url)
            previewUrls.current.delete(file.name)
          }
          setPreviews((prevPreviews) => {
            const next = new Map(prevPreviews)
            next.delete(file.name)
            return next
          })
        }
        const next = prev.filter((_, i) => i !== index)
        onFilesSelected(next)
        return next
      })
      setRejections([])
    },
    [onFilesSelected],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept,
    maxFiles: maxFiles - files.length,
    maxSize,
    disabled: disabled || files.length >= maxFiles,
  })

  const acceptHint =
    hint ??
    `Max ${maxFiles} files, up to ${formatSize(maxSize)} each. ${Object.values(accept).flat().join(', ')}`

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Drop zone */}
      <div
        {...getRootProps()}
        className={cn(
          'group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragActive
            ? 'border-primary bg-primary-soft/50 scale-[1.01]'
            : 'border-border hover:border-border-strong hover:bg-fill-hover/30',
          disabled && 'cursor-not-allowed opacity-50',
          files.length > 0 && !isDragActive && 'border-border',
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            'mb-3 rounded-full p-2.5 transition-colors duration-200',
            isDragActive ? 'bg-primary/10 text-primary' : 'bg-muted text-fg-subtle group-hover:bg-fill-hover group-hover:text-fg-muted',
          )}
        >
          {isDragActive ? (
            <Check className="size-5" aria-hidden="true" />
          ) : (
            <UploadIcon className="size-5" aria-hidden="true" />
          )}
        </div>
        {isDragActive ? (
          <p className="text-sm font-medium text-primary">Drop to add files</p>
        ) : (
          <>
            <p className="text-sm font-medium text-fg">{label}</p>
            <p className="mt-1 text-xs text-fg-subtle">or click to browse</p>
          </>
        )}
        <p className="mt-2 text-xs text-fg-subtle">{acceptHint}</p>
      </div>

      {/* Rejection errors */}
      {rejections.length > 0 && (
        <div className="space-y-2">
          {rejections.map(({ file, errors }) => (
            <div
              key={file.name}
              className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-soft px-3 py-2 text-sm text-danger-text"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="font-medium">{file.name}</span> — {errors.map((e) => e.message).join(', ')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Selected files list */}
      {files.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-fg-muted">
            {files.length} file{files.length === 1 ? '' : 's'} selected
          </p>
          <ul className="space-y-1">
            {files.map((file, index) => {
              const preview = previews.get(file.name)
              const isHovered = hoveredIndex === index
              return (
                <li
                  key={`${file.name}-${index}`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={cn(
                    'group/item flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-150',
                    isHovered
                      ? 'border-primary/40 bg-primary-soft/30 shadow-xs'
                      : 'border-border bg-surface',
                  )}
                >
                  {/* Preview or icon */}
                  {preview ? (
                    <img
                      src={preview}
                      alt={file.name}
                      className="size-10 shrink-0 rounded-md object-cover ring-1 ring-border"
                    />
                  ) : (
                    <div className="grid size-10 shrink-0 place-items-center rounded-md bg-muted">
                      {getFileIcon(file)}
                    </div>
                  )}

                  {/* File info */}
                  <div className="min-w-0 flex-1">
                    <p className={cn(
                      'truncate text-sm font-medium transition-colors duration-150',
                      isHovered ? 'text-fg' : 'text-fg-muted',
                    )}>
                      {file.name}
                    </p>
                    <p className="text-xs text-fg-subtle">{formatSize(file.size)}</p>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    aria-label={`Remove ${file.name}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className={cn(
                      'rounded-md p-1.5 text-fg-subtle outline-none transition-all duration-150',
                      'hover:bg-danger-soft hover:text-danger-text',
                      'focus-visible:ring-2 focus-visible:ring-ring/60',
                      isHovered ? 'opacity-100' : 'opacity-0 group-focus-within/item:opacity-100',
                    )}
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
