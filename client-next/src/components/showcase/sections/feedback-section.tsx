import { useState } from 'react'
import { FileText, Plus } from 'lucide-react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Progress,
  Skeleton,
  Spinner,
} from '@/components/ui'
import { Demo, ShowcaseSection } from '../shared'

export function FeedbackSection() {
  const [dismissed, setDismissed] = useState(false)
  const [loadPhase, setLoadPhase] = useState<'error' | 'loading' | 'done'>('error')

  const simulateRetry = () => {
    setLoadPhase('loading')
    window.setTimeout(() => setLoadPhase(Math.random() > 0.3 ? 'done' : 'error'), 900)
  }

  return (
    <ShowcaseSection
      id="feedback"
      title="Feedback & States"
      description="Alerts, loading indicators and the empty/error state patterns every async view should implement."
    >
      <Demo title="Alerts" layout="stack">
        <div className="grid w-full gap-3 lg:grid-cols-2">
          <Alert variant="info">
            <AlertTitle>Project updated</AlertTitle>
            <AlertDescription>Globex Industries was added to PRJ-002.</AlertDescription>
          </Alert>
          <Alert variant="success">
            <AlertTitle>Project shared</AlertTitle>
            <AlertDescription>Your project was shared with ada@example.com.</AlertDescription>
          </Alert>
          <Alert variant="warning">
            <AlertTitle>Deadline approaching</AlertTitle>
            <AlertDescription>PRJ-003 is due in 2 days.</AlertDescription>
          </Alert>
          <Alert variant="danger">
            <AlertTitle>Failed to send</AlertTitle>
            <AlertDescription>The client’s email address is invalid.</AlertDescription>
          </Alert>
        </div>
        {!dismissed ? (
          <Alert variant="info" onClose={() => setDismissed(true)}>
            <AlertTitle>Dismissible alert</AlertTitle>
            <AlertDescription>Click the close button to dismiss this alert.</AlertDescription>
          </Alert>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setDismissed(false)}>Restore alert</Button>
        )}
      </Demo>

      <Demo title="Loading — spinners & progress" layout="stack">
        <div className="flex flex-wrap items-center gap-6 text-fg-muted">
          <Spinner size="xs" />
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <span className="flex items-center gap-2 text-sm text-fg">Saving… <Spinner size="sm" /></span>
        </div>
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-fg-muted">Uploading attachment</span>
            <span className="font-medium tabular-nums text-fg">65%</span>
          </div>
          <Progress value={65} />
          <Progress indeterminate aria-label="Loading projects" />
        </div>
      </Demo>

      <Demo title="Loading — skeletons" layout="stack">
        <Card className="max-w-sm p-5">
          <div className="flex items-center gap-4">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex-1 space-y-2.5">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <div className="mt-5 space-y-2.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-4/6" />
          </div>
        </Card>
        <p className="text-sm text-fg-muted">
          Use skeletons to mirror the layout of incoming content; reserve spinners for inline actions.
        </p>
      </Demo>

      <Demo title="Empty state">
        <EmptyState
          icon={FileText}
          title="No projects yet"
          description="Create your first project and it will show up here, ready to share with your team."
          action={<Button size="sm"><Plus /> New project</Button>}
        />
      </Demo>

      <Demo title="Error state with retry" layout="stack">
        {loadPhase === 'error' && (
          <ErrorState
            title="Couldn't load projects"
            description="We lost connection while fetching your projects. Check your network and try again."
            onRetry={simulateRetry}
          />
        )}
        {loadPhase === 'loading' && (
          <div className="flex items-center justify-center gap-3 py-10 text-sm text-fg-muted">
            <Spinner /> Retrying…
          </div>
        )}
        {loadPhase === 'done' && (
          <Alert variant="success" className="py-8 [&>div]:text-center">
            <AlertTitle>Projects loaded</AlertTitle>
            <AlertDescription>The retry succeeded — in a real app the list would render here.</AlertDescription>
          </Alert>
        )}
      </Demo>
    </ShowcaseSection>
  )
}
