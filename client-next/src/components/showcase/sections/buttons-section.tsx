import { ChevronRight, Plus, Trash2 } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button-variants'
import { Button } from '@/components/ui/button'
import { Demo, ShowcaseSection } from '../shared'

const variantList = [
  ['primary', 'Create project'],
  ['secondary', 'Save draft'],
  ['outline', 'Preview'],
  ['ghost', 'Duplicate'],
  ['soft', 'Send later'],
  ['danger', 'Delete'],
  ['danger-ghost', 'Remove item'],
  ['link', 'View history'],
] as const

export function ButtonsSection() {
  return (
    <ShowcaseSection
      id="buttons"
      title="Buttons"
      description="Every variant implements hover, focus-visible, active, disabled and loading states. Use buttonVariants() to apply the same styles to links."
    >
      <Demo title="Variants">
        {variantList.map(([variant, label]) => (
          <Button key={variant} variant={variant}>
            {label}
          </Button>
        ))}
      </Demo>

      <Demo title="Sizes">
        <Button size="xs" variant="outline">Extra small</Button>
        <Button size="sm" variant="outline">Small</Button>
        <Button size="md" variant="outline">Medium</Button>
        <Button size="lg" variant="outline">Large</Button>
        <span className="mx-2 h-8 w-px bg-border" aria-hidden="true" />
        <Button size="icon-sm" variant="outline" aria-label="Add"><Plus /></Button>
        <Button size="icon" variant="outline" aria-label="Add"><Plus /></Button>
        <Button size="icon-lg" variant="outline" aria-label="Add"><Plus /></Button>
      </Demo>

      <Demo title="With icons">
        <Button><Plus /> Create project</Button>
        <Button variant="secondary">Next step <ChevronRight /></Button>
        <Button variant="danger"><Trash2 /> Delete project</Button>
      </Demo>

      <Demo title="States">
        <Button disabled>Disabled</Button>
        <Button variant="outline" disabled>Disabled outline</Button>
        <Button loading>Saving…</Button>
        <Button variant="soft" loading>Processing</Button>
        <Button variant="danger" loading>Deleting…</Button>
      </Demo>

      <Demo title="As a link (buttonVariants)">
        <a href="#buttons" className={buttonVariants({ variant: 'link' })}>
          Anchor styled as a link button
        </a>
        <a href="#foundations" className={buttonVariants({ variant: 'primary', size: 'sm' })}>
          <Plus /> Go to foundations
        </a>
      </Demo>
    </ShowcaseSection>
  )
}
