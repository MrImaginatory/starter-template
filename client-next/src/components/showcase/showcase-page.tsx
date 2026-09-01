import { ThemeModeSwitch } from '@/components/theme/theme-mode-switch'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { socials } from '@/config/socials'
import { useActiveSection } from './use-active-section'
import { FoundationsSection } from './sections/foundations'
import { ThemingSection } from './sections/theming-section'
import { ButtonsSection } from './sections/buttons-section'
import { FormsSection } from './sections/forms-section'
import { ControlsSection } from './sections/controls-section'
import { OverlaysSection } from './sections/overlays-section'
import { NavigationSection } from './sections/navigation-section'
import { DataSection } from './sections/data-section'
import { FeedbackSection } from './sections/feedback-section'

const tocItems = [
  ['foundations', 'Foundations'],
  ['theming', 'Personalization'],
  ['buttons', 'Buttons'],
  ['forms', 'Inputs & Forms'],
  ['controls', 'Selection Controls'],
  ['overlays', 'Overlays'],
  ['navigation', 'Navigation'],
  ['data-display', 'Data Display'],
  ['feedback', 'Feedback & States'],
] as const

export function ShowcasePage() {
  const activeId = useActiveSection(tocItems.map(([id]) => id).join(' '))

  return (
    <div className="container-page py-10 lg:py-14">
      <header className="max-w-3xl">
        <Badge variant="primary" size="md">Design System · v1.0</Badge>
        <h1 className="mt-5 text-display text-fg">
          A production-ready component library for modern web apps.
        </h1>
        <p className="mt-4 text-lead text-fg-muted">
          Every component below is theme-aware, responsive and accessible by default.
          This page is the single source of truth for the application’s UI — build new
          features exclusively from these primitives.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ThemeModeSwitch />
          <span className="hidden text-sm text-fg-subtle sm:inline">
            Try it — the whole system switches instantly.
          </span>
          <span className="hidden h-5 w-px bg-border sm:inline" aria-hidden="true" />
          <nav aria-label="Social links" className="flex items-center gap-1">
            {socials.map(({ platform, label, url, icon: Icon }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-8 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </nav>
        </div>
      </header>

      <Separator />

      <div className="grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav aria-label="Sections" className="sticky top-24 space-y-1 border-l border-border">
            {tocItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeId === id ? 'true' : undefined}
                className={cn(
                  '-ml-px block border-l-2 px-4 py-1.5 text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/60',
                  activeId === id
                    ? 'border-primary font-medium text-primary-text'
                    : 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg',
                )}
              >
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main id="components" className="min-w-0 space-y-16 lg:space-y-20">
          <FoundationsSection />
          <ThemingSection />
          <ButtonsSection />
          <FormsSection />
          <ControlsSection />
          <OverlaysSection />
          <NavigationSection />
          <DataSection />
          <FeedbackSection />
        </main>
      </div>
    </div>
  )
}

function Separator() {
  return <hr className="my-12 border-0 border-t border-border lg:my-14" />
}
