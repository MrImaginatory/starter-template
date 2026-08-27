import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import { formatCurrency, formatDate } from '@/lib/format'
import { capitalize } from '@/lib/string'
import { Demo, ShowcaseSection } from '../shared'

const projects = [
  { id: 'PRJ-001', name: 'Acme Corporation', owner: 'Ada Lovelace', amount: 4200, due: '2026-09-02', status: 'active' as const },
  { id: 'PRJ-002', name: 'Globex Industries', owner: 'Grace Hopper', amount: 1850.5, due: '2026-08-30', status: 'completed' as const },
  { id: 'PRJ-003', name: 'Stark Enterprises', owner: 'Alan Turing', amount: 975, due: '2026-08-14', status: 'overdue' as const },
  { id: 'PRJ-004', name: 'Wayne Logistics', owner: 'Linus Torvalds', amount: 3120.75, due: '2026-09-15', status: 'draft' as const },
]

const statusBadges = {
  active: <Badge variant="info" dot>{capitalize('active')}</Badge>,
  completed: <Badge variant="success" dot>{capitalize('completed')}</Badge>,
  overdue: <Badge variant="danger" dot>{capitalize('overdue')}</Badge>,
  draft: <Badge>{capitalize('draft')}</Badge>,
}

export function DataSection() {
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const allSelected = selected.size === projects.length
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(projects.map((p) => p.id)))
  }

  const toggleRow = (idKey: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(idKey)) next.delete(idKey)
      else next.add(idKey)
      return next
    })
  }

  return (
    <ShowcaseSection
      id="data-display"
      title="Data Display"
      description="Badges, avatars, cards, tables and separators — composed from the same primitives used across the app."
    >
      <Demo title="Badges">
        <Badge>Default</Badge>
        <Badge variant="primary">Primary</Badge>
        <Badge variant="success" dot>Active</Badge>
        <Badge variant="warning" dot>Pending</Badge>
        <Badge variant="danger" dot>Overdue</Badge>
        <Badge variant="info" dot>Sent</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge size="md" variant="primary" dot>Large badge</Badge>
      </Demo>

      <Demo title="Avatars">
        <Avatar name="Ada Lovelace" size="sm" />
        <Avatar name="Grace Hopper" />
        <Avatar name="Alan Turing" size="lg" />
        <div className="flex -space-x-2.5">
          <Avatar name="Ada Lovelace" className="ring-2 ring-surface" />
          <Avatar name="Grace Hopper" className="ring-2 ring-surface" />
          <Avatar name="Alan Turing" className="ring-2 ring-surface" />
          <span className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-muted text-xs font-semibold text-fg-muted ring-2 ring-surface">
            +6
          </span>
        </div>
      </Demo>

      <Demo title="Cards" layout="stack">
        <div className="grid w-full gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardDescription>Total revenue</CardDescription>
              <CardTitle className="text-h2">{formatCurrency(12480)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex items-center gap-2 text-sm text-fg-muted">
                <Badge variant="success">+12%</Badge> vs last quarter
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Create your first project</CardTitle>
              <CardDescription>
                Add team members, set milestones and track progress in under a minute.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1" />
            <CardFooter className="justify-between">
              <Button variant="ghost">Learn more</Button>
              <Button><Plus /> New project</Button>
            </CardFooter>
          </Card>
        </div>
      </Demo>

      <Demo title="Table with row selection" layout="stack">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  aria-label="Select all projects"
                  checked={allSelected ? true : someSelected ? 'indeterminate' : false}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Project</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Due date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id} selected={selected.has(project.id)}>
                <TableCell>
                  <Checkbox
                    aria-label={`Select ${project.id}`}
                    checked={selected.has(project.id)}
                    onCheckedChange={() => toggleRow(project.id)}
                  />
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2.5 font-medium text-fg">
                    <Avatar name={project.owner} size="sm" />
                    {project.name}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-xs text-fg-muted">{project.id}</TableCell>
                <TableCell className="text-right font-medium tabular-nums">{formatCurrency(project.amount)}</TableCell>
                <TableCell className="text-fg-muted">{formatDate(project.due)}</TableCell>
                <TableCell>{statusBadges[project.status]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-fg-muted">
          {selected.size === 0
            ? 'No rows selected.'
            : `${selected.size} project${selected.size === 1 ? '' : 's'} selected.`}
        </p>
      </Demo>

      <Demo title="Empty table state">
        <div className="w-full py-2">
          <EmptyTableHint />
        </div>
      </Demo>

      <Demo title="Separator">
        <div className="w-full space-y-4">
          <p className="text-sm text-fg-muted">Content above the divider.</p>
          <Separator />
          <p className="text-sm text-fg-muted">Content below the divider.</p>
          <div className="flex h-10 items-center gap-4">
            <span className="text-sm text-fg-muted">Start</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-fg-muted">Middle</span>
            <Separator orientation="vertical" />
            <span className="text-sm text-fg-muted">End</span>
          </div>
        </div>
      </Demo>
    </ShowcaseSection>
  )
}

function EmptyTableHint() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border-strong p-8 text-center">
      <FileText className="size-5 text-fg-subtle" aria-hidden="true" />
      <p className="text-sm font-medium text-fg">No projects match your filters</p>
      <p className="max-w-xs text-xs text-fg-muted">Try adjusting or clearing the filters to see more results.</p>
    </div>
  )
}
