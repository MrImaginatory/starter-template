import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSettings } from '@/components/settings'
import { BRAND_PRESETS } from '@/lib/brand-scale'
import { FONT_SIZE_STEPS } from '@/lib/settings'
import { cn } from '@/lib/utils'
import { Demo, ShowcaseSection } from '../shared'

export function ThemingSection() {
  const { setPanelOpen, settings, setPrimaryColor, setFontScale } = useSettings()

  return (
    <ShowcaseSection
      id="theming"
      title="Personalization"
      description="Users can re-theme the product live from the settings panel — primary color, font family (Google Fonts or a custom .ttf/.otf file) and base text size. Everything persists in localStorage and is applied before first paint."
    >
      <Demo title="Settings panel" layout="stack">
        <p className="max-w-xl text-sm text-fg-muted">
          The panel is a Sheet built from the design system. Changing the primary color regenerates
          the full brand scale in OKLCH — buttons, hover states, focus rings, badges and charts all
          follow automatically.
        </p>
        <div>
          <Button onClick={() => setPanelOpen(true)}>
            <Settings2 />
            Open settings
          </Button>
        </div>
      </Demo>

      <Demo title="Primary color — apply directly" layout="stack">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={settings.primaryColor === null}
            title="Default (Indigo)"
            onClick={() => setPrimaryColor(null)}
            style={{ background: 'linear-gradient(to bottom right, #6366f1, #4338ca)' }}
            className={cn(
              'grid size-10 cursor-pointer place-items-center rounded-full border border-border text-white transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              settings.primaryColor === null && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
            )}
          >
            <span className="text-[0.625rem] font-semibold">Auto</span>
          </button>
          {BRAND_PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              aria-pressed={settings.primaryColor === preset.value}
              title={preset.name}
              onClick={() => setPrimaryColor(preset.value)}
              style={{ backgroundColor: preset.value }}
              className={cn(
                'size-10 cursor-pointer rounded-full shadow-xs transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                settings.primaryColor === preset.value && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
              )}
            />
          ))}
        </div>
        <p className="text-sm text-fg-muted">
          Try switching the theme to dark afterwards — dark-mode variants of the chosen hue are
          derived from the same scale.
        </p>
      </Demo>

      <Demo title="Text size — quick set" layout="stack">
        <div className="flex flex-wrap gap-2">
          {FONT_SIZE_STEPS.map((step, index) => (
            <Button
              key={step.label}
              size="sm"
              variant={settings.fontScale === index ? 'primary' : 'outline'}
              aria-pressed={settings.fontScale === index}
              onClick={() => setFontScale(index)}
            >
              {step.label}
              <span className="text-xs opacity-60">{step.size}px</span>
            </Button>
          ))}
        </div>
        <p className="text-sm text-fg-muted">
          Sizes scale the root font size, so spacing, radii and the fluid type scale grow together —
          the layout never breaks.
        </p>
      </Demo>
    </ShowcaseSection>
  )
}
