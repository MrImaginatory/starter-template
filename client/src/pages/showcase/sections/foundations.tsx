import { ThemeModeSwitch } from '@/components/theme/theme-mode-switch'
import { capitalize, capitalizeWords, truncate, initials, kebabToTitle } from '@/lib/string'
import { Demo, ShowcaseSection, TokenSwatch } from '../shared'

const semanticGroups = [
  {
    title: 'Surfaces',
    tokens: [
      ['Page background', '--background'],
      ['Cards & panels', '--surface'],
      ['Subtle fill', '--muted'],
      ['Hover fill', '--fill-hover'],
      ['Modal overlay', '--overlay'],
    ],
  },
  {
    title: 'Text',
    tokens: [
      ['Primary text', '--fg'],
      ['Secondary text', '--fg-muted'],
      ['Placeholder / faint', '--fg-subtle'],
    ],
  },
  {
    title: 'Borders & focus',
    tokens: [
      ['Default border', '--border'],
      ['Strong border', '--border-strong'],
      ['Input border', '--input'],
      ['Focus ring', '--ring'],
    ],
  },
  {
    title: 'Primary (brand)',
    tokens: [
      ['Action', '--primary'],
      ['Hover', '--primary-hover'],
      ['Soft background', '--primary-soft'],
      ['Text on page', '--primary-text'],
    ],
  },
]

const statusGroups = ['success', 'warning', 'danger', 'info'] as const

const typeSpecimens = [
  { label: 'display', className: 'text-display', sample: 'Build something great' },
  { label: 'h1', className: 'text-h1', sample: 'Project #PRJ-001' },
  { label: 'h2', className: 'text-h2', sample: 'Quarterly summary' },
  { label: 'h3', className: 'text-h3', sample: 'Team details' },
  { label: 'lead', className: 'text-lead text-fg-muted', sample: 'A short introductory paragraph for sections.' },
  { label: 'base', className: 'text-base', sample: 'Body copy for descriptions and content.' },
  { label: 'sm', className: 'text-sm', sample: 'Secondary information and labels.' },
  { label: 'xs', className: 'text-xs text-fg-muted', sample: 'Captions, hints and metadata.' },
]

const brandScale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

const radiusSamples = [
  ['rounded-xs', 'xs'],
  ['rounded-sm', 'sm'],
  ['rounded-md', 'md'],
  ['rounded-lg', 'lg'],
  ['rounded-xl', 'xl'],
  ['rounded-2xl', '2xl'],
  ['rounded-3xl', '3xl'],
] as const

const shadowSamples = [
  ['shadow-xs', 'xs'],
  ['shadow-sm', 'sm'],
  ['shadow-md', 'md'],
  ['shadow-lg', 'lg'],
  ['shadow-xl', 'xl'],
  ['shadow-2xl', '2xl'],
] as const

export function FoundationsSection() {
  return (
    <ShowcaseSection
      id="foundations"
      title="Foundations"
      description="Theme modes, semantic color tokens and the fluid type scale. Every color in the app resolves from these tokens in both light and dark themes."
    >
      <Demo title="Theme mode" layout="stack">
        <p className="max-w-xl text-sm text-fg-muted">
          The theme persists to <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">localStorage</code>{' '}
          and follows the system preference when set to System.
        </p>
        <div>
          <ThemeModeSwitch />
        </div>
      </Demo>

      <Demo title="Semantic tokens" layout="grid">
        {semanticGroups.map((group) => (
          <div key={group.title} className="space-y-3">
            <h4 className="text-sm font-semibold text-fg">{group.title}</h4>
            {group.tokens.map(([name, token]) => (
              <TokenSwatch key={token} name={name} token={token} />
            ))}
          </div>
        ))}
      </Demo>

      <Demo title="Status colors" layout="grid">
        {statusGroups.map((status) => (
          <div key={status} className="space-y-3">
            <h4 className="text-sm font-semibold capitalize text-fg">{status}</h4>
            <TokenSwatch name="Solid" token={`--${status}`} />
            <TokenSwatch name="Soft" token={`--${status}-soft`} />
            <TokenSwatch name="Text" token={`--${status}-text`} />
          </div>
        ))}
      </Demo>

      <Demo title="Brand palette">
        <div className="w-full space-y-2">
          {brandScale.map((step) => (
            <div key={step} className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-7 flex-1 rounded-md border border-black/5"
                style={{ backgroundColor: `var(--color-brand-${step})` }}
              />
              <code className="w-20 text-xs text-fg-muted">brand-{step}</code>
            </div>
          ))}
        </div>
      </Demo>

      <Demo title="Typography scale (fluid via clamp())" layout="stack">
        <div className="divide-y divide-border">
          {typeSpecimens.map(({ label, className, sample }) => (
            <div key={label} className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
              <code className="w-16 shrink-0 text-xs font-medium text-primary-text">{label}</code>
              <span className={className}>{sample}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-fg-muted">
          Headings scale fluidly between viewport sizes using CSS <code>clamp()</code> — resize the window to see them glide instead of jump.
        </p>
      </Demo>

      <Demo title="Radius & elevation" layout="stack">
        <div className="grid w-full grid-cols-4 gap-4 sm:grid-cols-7">
          {radiusSamples.map(([radiusClass, label]) => (
            <div key={label} className="space-y-2 text-center">
              <div className={`mx-auto size-14 ${radiusClass} border-2 border-primary/30 bg-primary-soft`} />
              <code className="block text-xs text-fg-muted">{label}</code>
            </div>
          ))}
        </div>
        <div className="grid w-full grid-cols-3 gap-6 pt-2 sm:grid-cols-6">
          {shadowSamples.map(([shadowClass, label]) => (
            <div key={label} className="space-y-2 text-center">
              <div className={`mx-auto size-14 rounded-lg bg-surface ring-1 ring-border ${shadowClass}`} />
              <code className="block text-xs text-fg-muted">{label}</code>
            </div>
          ))}
        </div>
      </Demo>

      <Demo title="String utilities" layout="stack">
        <div className="grid w-full gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">capitalize</h4>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">capitalize('project created')</code> →{' '}
              <span className="font-medium text-fg">{capitalize('project created')}</span>
            </p>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">capitalize('active')</code> →{' '}
              <span className="font-medium text-fg">{capitalize('active')}</span>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">capitalizeWords</h4>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">capitalizeWords('line item')</code> →{' '}
              <span className="font-medium text-fg">{capitalizeWords('line item')}</span>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">truncate</h4>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">truncate('Acme Corporation Ltd.', 15)</code> →{' '}
              <span className="font-medium text-fg">{truncate('Acme Corporation Ltd.', 15)}</span>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">initials</h4>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">initials('Ada Lovelace')</code> →{' '}
              <span className="font-medium text-fg">{initials('Ada Lovelace')}</span>
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-fg">kebabToTitle</h4>
            <p className="text-sm text-fg-muted">
              <code className="font-mono text-xs">kebabToTitle('data-display')</code> →{' '}
              <span className="font-medium text-fg">{kebabToTitle('data-display')}</span>
            </p>
          </div>
        </div>
      </Demo>
    </ShowcaseSection>
  )
}
