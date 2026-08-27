import { useCallback, useEffect, type ComponentProps } from 'react'
import type { Editor } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

/* ------------------------------------------------------------------ */
/*  RichTextEditor                                                     */
/* ------------------------------------------------------------------ */

export interface RichTextEditorProps extends Omit<ComponentProps<'div'>, 'onChange'> {
  value?: string
  onValueChange?: (html: string) => void
  placeholder?: string
  editable?: boolean
  minHeight?: string
  showToolbar?: boolean
}

export function RichTextEditor({
  value,
  onValueChange,
  placeholder = 'Start writing…',
  editable = true,
  minHeight = '10rem',
  showToolbar = true,
  className,
  ...props
}: RichTextEditorProps) {
  const handleUpdate = useCallback(
    ({ editor: e }: { editor: Editor }) => {
      onValueChange?.(e.getHTML())
    },
    [onValueChange],
  )

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: {},
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? '',
    editable,
    onUpdate: handleUpdate,
    immediatelyRender: false,
  })

  // Sync external value changes into the editor
  useEffect(() => {
    if (!editor || value === undefined) return
    if (editor.getHTML() === value) return
    editor.commands.setContent(value, { emitUpdate: false })
  }, [editor, value])

  // Sync editable prop
  useEffect(() => {
    if (!editor) return
    editor.setEditable(editable)
  }, [editor, editable])

  if (!editor) return null

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-input bg-surface shadow-xs transition-[border-color,box-shadow] duration-150',
        'focus-within:border-primary focus-within:ring-[3px] focus-within:ring-primary/25',
        className,
      )}
      {...props}
    >
      {showToolbar && <EditorToolbar editor={editor} />}
      <div style={{ minHeight }}>
        <EditorContent editor={editor} className="tiptap" />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  EditorToolbar                                                      */
/* ------------------------------------------------------------------ */

export interface EditorToolbarProps {
  editor: Editor
  className?: string
}

export function EditorToolbar({ editor, className }: EditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Formatting options"
      className={cn(
        'flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 px-2 py-1.5',
        className,
      )}
    >
      <ToolbarGroup>
        <ToolbarButton
          icon={Bold}
          label="Bold"
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarButton
          icon={Italic}
          label="Italic"
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarButton
          icon={Strikethrough}
          label="Strikethrough"
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        />
        <ToolbarButton
          icon={Underline}
          label="Underline"
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarButton
          icon={Code}
          label="Inline code"
          active={editor.isActive('code')}
          onClick={() => editor.chain().focus().toggleCode().run()}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          icon={Heading1}
          label="Heading 1"
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarButton
          icon={Heading2}
          label="Heading 2"
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarButton
          icon={Heading3}
          label="Heading 3"
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <ToolbarButton
          icon={List}
          label="Bullet list"
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Ordered list"
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarButton
          icon={Quote}
          label="Blockquote"
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarButton
          icon={Minus}
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        />
      </ToolbarGroup>

      <div className="flex-1" />

      <ToolbarGroup>
        <ToolbarButton
          icon={Undo}
          label="Undo"
          disabled={!editor.can().undo()}
          onClick={() => editor.chain().focus().undo().run()}
        />
        <ToolbarButton
          icon={Redo}
          label="Redo"
          disabled={!editor.can().redo()}
          onClick={() => editor.chain().focus().redo().run()}
        />
      </ToolbarGroup>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Toolbar primitives                                                 */
/* ------------------------------------------------------------------ */

function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
}

function ToolbarButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'text-fg-muted',
        active && 'bg-fill-hover text-fg',
        disabled && 'opacity-40',
      )}
    >
      <Icon className="size-4" />
    </Button>
  )
}
