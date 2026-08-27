import { useRef, type ChangeEvent } from 'react'
import { Check, RotateCw, Upload, X } from 'lucide-react'
import { BRAND_PRESETS } from '@/lib/brand-scale'
import {
  fileToDataUrl,
  FONT_SIZE_STEPS,
  GOOGLE_FONTS,
  MAX_CUSTOM_FONT_BYTES,
} from '@/lib/settings'
import { cn } from '@/lib/utils'
import { useConfirm } from '@/components/ui/confirm-dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useToast } from '@/components/ui/toast'
import { ThemeModeSwitch } from '@/components/theme/theme-mode-switch'
import { useSettings } from './settings-context'

export function SettingsPanel() {
  const {
    settings,
    setPrimaryColor,
    setGoogleFont,
    setCustomFont,
    setFontScale,
    resetSettings,
    panelOpen,
    setPanelOpen,
  } = useSettings()
  const toast = useToast()
  const confirm = useConfirm()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    if (!/\.(ttf|otf)$/i.test(file.name)) {
      toast.danger('Unsupported file', 'Only .ttf and .otf font files are supported.')
      return
    }
    if (file.size > MAX_CUSTOM_FONT_BYTES) {
      toast.danger('File too large', 'Custom fonts must be 2 MB or smaller.')
      return
    }

    try {
      const dataUrl = await fileToDataUrl(file)
      setCustomFont({ name: file.name.replace(/\.(ttf|otf)$/i, ''), dataUrl })
      setGoogleFont(null)
      toast.success('Font applied', `“${file.name}” is now the interface font.`)
    } catch {
      toast.danger('Could not read font', 'The file appears to be corrupted.')
    }
  }

  const handleReset = async () => {
    const ok = await confirm({
      title: 'Reset appearance?',
      description: 'Primary color, font and text size will return to their defaults.',
      confirmLabel: 'Reset',
      variant: 'primary',
    })
    if (!ok) return
    resetSettings()
    toast.success('Settings reset', 'Appearance is back to the default theme.')
  }

  const activeFontSize = FONT_SIZE_STEPS[settings.fontScale] ?? FONT_SIZE_STEPS[2]

  return (
    <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Personalize the workspace. Changes apply instantly and are saved in this browser.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fg">Theme</h3>
            <ThemeModeSwitch />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fg">Primary color</h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                aria-pressed={settings.primaryColor === null}
                title="Default (Indigo)"
                onClick={() => setPrimaryColor(null)}
                style={{ background: 'linear-gradient(to bottom right, #6366f1, #4338ca)' }}
                className={cn(
                  'grid size-9 cursor-pointer place-items-center rounded-full border border-border text-white transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                  settings.primaryColor === null && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                )}
              >
                {settings.primaryColor === null && <Check className="size-4" aria-hidden="true" />}
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
                    'grid size-9 cursor-pointer place-items-center rounded-full text-white shadow-xs transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    settings.primaryColor === preset.value && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                  )}
                >
                  {settings.primaryColor === preset.value && <Check className="size-4" aria-hidden="true" />}
                </button>
              ))}
              <label
                title="Custom color"
                className={cn(
                  'relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-border transition-transform hover:scale-105 focus-within:ring-2 focus-within:ring-ring/60 focus-within:ring-offset-2 focus-within:ring-offset-background',
                  settings.primaryColor && !BRAND_PRESETS.some((p) => p.value === settings.primaryColor)
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : '',
                )}
                style={
                  settings.primaryColor && !BRAND_PRESETS.some((p) => p.value === settings.primaryColor)
                    ? { backgroundColor: settings.primaryColor }
                    : undefined
                }
              >
                {!settings.primaryColor && (
                  <span
                    aria-hidden="true"
                    className="size-5 rounded-full"
                    style={{
                      background:
                        'conic-gradient(#f43f5e, #f59e0b, #10b981, #0ea5e9, #6366f1, #d946ef, #f43f5e)',
                    }}
                  />
                )}
                <input
                  type="color"
                  aria-label="Custom primary color"
                  value={settings.primaryColor ?? '#6366f1'}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute inset-0 size-full cursor-pointer opacity-0"
                />
              </label>
            </div>
            <p className="text-xs text-fg-muted">
              Hover, focus rings, badges and charts follow the primary color automatically.
              {settings.primaryColor && (
                <>
                  {' '}
                  Current: <code className="font-mono">{settings.primaryColor}</code>
                </>
              )}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fg">Font</h3>
            <Select
              value={settings.customFont ? '__custom' : (settings.googleFont ?? '')}
              disabled={Boolean(settings.customFont)}
              onValueChange={(value) => {
                setGoogleFont(value === '' ? null : value)
              }}
            >
              <SelectTrigger aria-label="Google font">
                <SelectValue placeholder="Default (Inter)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Default (Inter)</SelectItem>
                {GOOGLE_FONTS.map((font) => (
                  <SelectItem key={font} value={font}>
                    {font}
                  </SelectItem>
                ))}
                {settings.customFont && (
                  <SelectItem value="__custom">{settings.customFont.name}</SelectItem>
                )}
              </SelectContent>
            </Select>

            {settings.customFont ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
                <span className="min-w-0 truncate text-sm font-medium text-fg">
                  {settings.customFont.name}
                  <span className="ml-2 text-xs font-normal text-fg-subtle">custom</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${settings.customFont.name}`}
                  onClick={() => {
                    setCustomFont(null)
                    toast.info('Custom font removed', 'The interface is back to the default font.')
                  }}
                >
                  <X />
                </Button>
              </div>
            ) : (
              <label
                className={cn(
                  'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-surface px-3 text-sm font-medium text-fg outline-none transition-[background-color,border-color,box-shadow] hover:border-border-strong hover:bg-fill-hover focus-within:ring-2 focus-within:ring-ring/60',
                )}
              >
                <Upload className="size-4 text-fg-muted" aria-hidden="true" />
                Upload .ttf / .otf
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".ttf,.otf"
                  className="sr-only"
                  onChange={handleFile}
                />
              </label>
            )}
            <p className="text-xs text-fg-muted">
              Choose a Google Font or upload a custom font file (max 2 MB). Fonts are stored locally in
              this browser.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-fg">Text size</h3>
            <div className="space-y-2">
              <Slider
                min={0}
                max={FONT_SIZE_STEPS.length - 1}
                step={1}
                value={settings.fontScale}
                onValueChange={setFontScale}
                aria-label="Text size"
                aria-valuetext={activeFontSize.label}
              />
              <div className="flex justify-between px-0.5">
                {FONT_SIZE_STEPS.map((step, index) => (
                  <span
                    key={step.label}
                    aria-hidden="true"
                    className={cn(
                      'text-xs',
                      index === settings.fontScale ? 'font-semibold text-primary-text' : 'text-fg-subtle',
                    )}
                  >
                    {step.label}
                  </span>
                ))}
              </div>
            </div>
            <p className="rounded-lg border border-border bg-background p-3 text-sm text-fg-muted">
              The quick brown fox jumps over the lazy dog — Project #PRJ-001 ·{' '}
              <span className="font-medium text-fg">$1,500.00</span>
            </p>
            <p className="text-xs text-fg-muted">
              Current size: <span className="font-medium text-fg">{activeFontSize.label}</span> ({activeFontSize.size}px
              base). The entire UI scales with it.
            </p>
          </section>
        </div>

        <SheetFooter className="justify-between border-t border-border">
          <Button variant="ghost" onClick={handleReset}>
            <RotateCw />
            Reset
          </Button>
          <Button onClick={() => setPanelOpen(false)}>Done</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
