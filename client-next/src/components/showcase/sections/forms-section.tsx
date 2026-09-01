import { useState } from 'react'
import { DollarSign, Search } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Field,
  Input,
  MultiSelect,
  RichTextEditor,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Upload,
} from '@/components/ui'
import { useToast } from '@/components/ui/toast'
import { Demo, ShowcaseSection } from '../shared'

interface FormValues {
  projectName: string
  email: string
  amount: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}
  if (!values.projectName.trim()) errors.projectName = 'Project name is required.'
  if (!values.email.trim()) errors.email = 'Email is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Enter a valid email address.'
  if (!values.amount.trim()) errors.amount = 'Budget is required.'
  else if (Number.isNaN(Number(values.amount)) || Number(values.amount) <= 0)
    errors.amount = 'Budget must be a positive number.'
  return errors
}

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On hold' },
]

const tagOptions = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'design', label: 'Design' },
  { value: 'devops', label: 'DevOps' },
  { value: 'research', label: 'Research' },
]

export function FormsSection() {
  const [values, setValues] = useState<FormValues>({ projectName: '', email: '', amount: '', notes: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [editorHtml, setEditorHtml] = useState('')
  const toast = useToast()

  const setField = (key: keyof FormValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
      toast.success('Project created', `Draft project for ${values.projectName} was saved.`)
    }
  }

  return (
    <ShowcaseSection
      id="forms"
      title="Inputs & Forms"
      description="Fields wire label, hint and error accessibility automatically through Field. Validation runs on submit; individual errors clear as the user types."
    >
      <Demo title="Input sizes">
        <div className="grid w-full gap-4 sm:grid-cols-3">
          <Field id="in-sm" label="Small">
            <Input size="sm" placeholder="Small input" />
          </Field>
          <Field id="in-md" label="Medium">
            <Input size="md" placeholder="Medium input" />
          </Field>
          <Field id="in-lg" label="Large">
            <Input size="lg" placeholder="Large input" />
          </Field>
        </div>
      </Demo>

      <Demo title="Input states & icons" layout="stack">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="in-search" label="Search projects" hint="Searches by name or project ID.">
            <Input leading={<Search />} placeholder="Search…" />
          </Field>
          <Field id="in-amount" label="Budget" hint="In your default currency.">
            <Input type="number" min={0} step="0.01" trailing={<DollarSign />} placeholder="0.00" />
          </Field>
          <Field id="in-error" label="Email" error="Enter a valid email address.">
            <Input defaultValue="not-an-email" invalid />
          </Field>
          <Field id="in-disabled" label="Project ID">
            <Input value="PRJ-001" disabled readOnly />
          </Field>
        </div>
      </Demo>

      <Demo title="Textarea, select & multi-select" layout="stack">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="ta-notes" label="Notes" hint="Visible to team members.">
            <Textarea placeholder="Project notes go here…" rows={3} />
          </Field>
          <Field id="sel-status" label="Filter by status" error="This field has an error.">
            <Select defaultValue="">
              <SelectTrigger invalid>
                <SelectValue placeholder="Select a status…" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field id="sel-tags" label="Tags" hint="Add one or more tags to categorize the project.">
          <MultiSelect
            options={tagOptions}
            value={selectedTags}
            onValueChange={setSelectedTags}
            placeholder="Select tags…"
          />
        </Field>
      </Demo>

      <Demo title="Rich text editor" layout="stack">
        <div className="w-full max-w-2xl space-y-4">
          <Field id="rte-basic" label="Description" hint="Rich text with formatting toolbar.">
            <RichTextEditor
              value={editorHtml}
              onValueChange={setEditorHtml}
              placeholder="Describe the task or project details…"
            />
          </Field>
          <p className="text-xs text-fg-muted">
            Output: <code className="font-mono text-fg-subtle">{editorHtml || '<p></p>'}</code>
          </p>
        </div>
      </Demo>

      <Demo title="Read-only & minimal editor" layout="stack">
        <div className="grid w-full gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">Read-only (pre-filled)</h4>
            <RichTextEditor
              editable={false}
              showToolbar={false}
              value="<h2>Project #PRJ-001</h2><p>Hi team,</p><p>Here's the plan for the upcoming sprint:</p><ul><li>UI redesign — <strong>2 weeks</strong></li><li>API integration — 1 week</li></ul><p>Deadline: <u>September 15</u>.</p>"
            />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">Minimal (no toolbar)</h4>
            <RichTextEditor
              showToolbar={false}
              placeholder="Type something…"
              minHeight="6rem"
            />
          </div>
        </div>
      </Demo>

      <Demo title="Validation example — create a project" layout="stack">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="f-project" label="Project name" required error={errors.projectName}>
              <Input
                value={values.projectName}
                onChange={setField('projectName')}
                placeholder="Acme Website Redesign"
                aria-invalid={Boolean(errors.projectName)}
              />
            </Field>
            <Field id="f-email" label="Owner email" required error={errors.email} hint="We'll send updates here.">
              <Input
                type="email"
                value={values.email}
                onChange={setField('email')}
                placeholder="ada@example.com"
              />
            </Field>
            <Field id="f-amount" label="Budget" required error={errors.amount}>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={values.amount}
                onChange={setField('amount')}
                placeholder="1,500.00"
              />
            </Field>
            <Field id="f-notes" label="Notes">
              <Textarea value={values.notes} onChange={setField('notes')} placeholder="Optional notes…" rows={1} />
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Button type="submit">Create project</Button>
            <Button type="button" variant="ghost">Cancel</Button>
          </div>
        </form>
        {submitted && (
          <Alert variant="success" onClose={() => setSubmitted(false)}>
            <AlertTitle>Project created</AlertTitle>
            <AlertDescription>
              Draft project for {values.projectName} was saved successfully.
            </AlertDescription>
          </Alert>
        )}
      </Demo>

      <Demo title="Accordion" layout="stack">
        <div className="w-full max-w-2xl">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I invite team members?</AccordionTrigger>
              <AccordionContent>
                Go to Project Settings → Team and click "Invite." Enter their email address and
                choose a role. They'll receive an invitation link.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I add tasks to a project?</AccordionTrigger>
              <AccordionContent>
                Open the project board and click "Add task." Fill in the title, description and
                assignee. You can reorder tasks by dragging the handle on the left.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I customize the project template?</AccordionTrigger>
              <AccordionContent>
                Yes — open Settings to change the primary color, font family, and text size. You can
                also upload a custom logo. These changes apply to all projects instantly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </Demo>

      <Demo title="File upload" layout="stack">
        <div className="w-full max-w-2xl">
          <Field id="upload-files" label="Attachments" hint="Upload supporting documents for this project.">
            <Upload
              maxFiles={3}
              maxSize={5 * 1024 * 1024}
              onFilesSelected={(files) => toast.info('Files selected', `${files.length} file(s) ready.`)}
              label="Drag & drop files"
              hint="PDF, images — max 3 files, 5 MB each"
            />
          </Field>
        </div>
      </Demo>
    </ShowcaseSection>
  )
}
