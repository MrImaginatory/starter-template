import { useState } from 'react'
import {
  Checkbox,
  DatePicker,
  Field,
  Radio,
  RadioGroup,
  Slider,
  Switch,
} from '@/components/ui'
import { Demo, ShowcaseSection } from '../shared'

export function ControlsSection() {
  const [date, setDate] = useState<Date | null>(null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [tristate, setTristate] = useState<boolean | 'indeterminate'>('indeterminate')
  const [sliderValue, setSliderValue] = useState(65)

  return (
    <ShowcaseSection
      id="controls"
      title="Selection Controls"
      description="Checkboxes (with indeterminate support), radios and switches. Each accepts an optional `label` prop for a wired-up, accessible control."
    >
      <Demo title="Checkbox" layout="stack">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Checkbox label="Unchecked" checked={false} onCheckedChange={() => {}} />
          <Checkbox label="Checked" checked onCheckedChange={() => {}} />
          <Checkbox
            label="Indeterminate"
            checked={tristate}
            onCheckedChange={(checked) => setTristate(checked === true)}
          />
          <Checkbox label="Disabled" disabled />
          <Checkbox label="Disabled & checked" disabled checked />
        </div>
        <div className="rounded-lg border border-border p-4">
          <Checkbox
            label="Email me updates"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked === true)}
          />
          <p className="mt-2 pl-7.5 text-xs text-fg-muted">
            State: <code className="font-mono">{String(termsAccepted)}</code>
          </p>
        </div>
      </Demo>

      <Demo title="Radio group">
        <div className="grid w-full gap-6 sm:grid-cols-2">
          <RadioGroup defaultValue="standard" aria-label="Frequency">
            <Radio value="daily" label="Daily" />
            <Radio value="standard" label="Weekly" />
            <Radio value="extended" label="Monthly" />
            <Radio value="custom" label="Custom" disabled />
          </RadioGroup>
          <RadioGroup defaultValue="email" orientation="horizontal" className="flex-row flex-wrap gap-4" aria-label="Delivery method">
            <Radio value="email" label="Email" />
            <Radio value="post" label="By post" />
          </RadioGroup>
        </div>
      </Demo>

      <Demo title="Switch" layout="stack">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <Switch label="Auto-sync" defaultChecked />
          <Switch label="Attach file" defaultChecked={false} />
          <Switch label="Recurring project" defaultChecked disabled />
        </div>
        <p className="text-sm text-fg-muted">
          Switches are used for instant settings; checkboxes for form submissions.
        </p>
      </Demo>

      <Demo title="Slider" layout="stack">
        <div className="w-full max-w-md space-y-2">
          <div className="flex items-center justify-between text-sm">
            <label htmlFor="demo-slider" className="font-medium text-fg">
              Volume
            </label>
            <span className="font-medium tabular-nums text-fg">{sliderValue}%</span>
          </div>
          <Slider
            id="demo-slider"
            value={sliderValue}
            onValueChange={setSliderValue}
            aria-label="Volume"
          />
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="w-48 space-y-1.5">
            <Slider value={2} min={0} max={5} step={1} onValueChange={() => {}} aria-label="Step slider" aria-valuetext="2" />
            <p className="text-xs text-fg-muted">Stepped (step = 1)</p>
          </div>
          <div className="w-48 space-y-1.5">
            <Slider value={40} disabled aria-label="Disabled slider" />
            <p className="text-xs text-fg-muted">Disabled</p>
          </div>
        </div>
      </Demo>

      <Demo title="Date picker" layout="stack">
        <div className="grid max-w-md gap-4 sm:grid-cols-2">
          <Field id="dp-due" label="Start date" hint="Defaults to today + 14 days.">
            <DatePicker value={date} onChange={setDate} placeholder="Select start date" />
          </Field>
          <Field id="dp-min" label="Issue date (min: today)">
            <DatePicker value={date ?? null} onChange={setDate} minDate={new Date()} placeholder="Today or later" />
          </Field>
        </div>
        <p className="text-sm text-fg-muted">
          Selected: <code className="font-mono text-fg">{date ? date.toDateString() : 'none'}</code>
        </p>
      </Demo>
    </ShowcaseSection>
  )
}
