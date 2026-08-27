import { Archive, Copy, Pencil, Trash2 } from 'lucide-react'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  Field,
  Input,
  Tooltip,
} from '@/components/ui'
import { useConfirm } from '@/components/ui/confirm-dialog'
import { useToast } from '@/components/ui/toast'
import { Demo, ShowcaseSection } from '../shared'

export function OverlaysSection() {
  const confirm = useConfirm()
  const toast = useToast()

  const handleDelete = async () => {
    const ok = await confirm({
      title: 'Delete this project?',
      description: 'This permanently removes PRJ-001 and all associated records. This action cannot be undone.',
      confirmLabel: 'Delete project',
      variant: 'danger',
    })
    if (ok) toast.success('Project deleted', 'PRJ-001 has been removed.')
  }

  return (
    <ShowcaseSection
      id="overlays"
      title="Overlays"
      description="Dialogs trap focus and restore it on close; menus support full keyboard navigation; tooltips work with hover and keyboard focus."
    >
      <Demo title="Dialog">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Add team member…</Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Add a new team member</DialogTitle>
              <DialogDescription>Team members are reusable across projects.</DialogDescription>
            </DialogHeader>
            <Field id="dlg-member" label="Name" required>
              <Input placeholder="Ada Lovelace" autoFocus />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>Save member</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo title="Confirm dialog">
        <Button variant="danger" onClick={handleDelete}>
          Delete project
        </Button>
        <p className="text-sm text-fg-muted">
          Opens a confirm dialog with danger styling. On confirm, a success toast is shown.
        </p>
      </Demo>

      <Demo title="Toast notifications" layout="stack">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success('Project saved', 'Draft PRJ-001 was saved successfully.')}
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.info('Reminder', 'Deadline is in 3 days.')}
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.warning('Heads up', 'This project is overdue.')}
          >
            Warning
          </Button>
          <Button
            variant="danger"
            onClick={() => toast.danger('Sync failed', 'The connection was lost.')}
          >
            Error
          </Button>
        </div>
        <p className="text-sm text-fg-muted">
          Toasts auto-dismiss after 5 seconds and stack in the bottom-right corner.
        </p>
      </Demo>

      <Demo title="Dropdown menu">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Row actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Row actions</DropdownMenuLabel>
            <DropdownMenuItem onSelect={() => {}}>
              <Copy /> Duplicate
              <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => {}}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => {}}>
              <Archive /> Archive
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onSelect={() => {}}>
              <Trash2 /> Delete
              <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <p className="text-sm text-fg-muted">
          Opens on click or <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd>; navigate with arrow keys.
        </p>
      </Demo>

      <Demo title="Tooltip">
        {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
          <Tooltip key={side} content={`Tooltip on the ${side}`} side={side}>
            <Button variant="outline" size="sm">
              Hover — {side}
            </Button>
          </Tooltip>
        ))}
      </Demo>
    </ShowcaseSection>
  )
}
