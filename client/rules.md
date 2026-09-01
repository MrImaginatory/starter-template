# Project Rules — Starter Kit

This document is the **contract** for everyone (human or AI) contributing to this codebase.
It defines how we design, build and organize UI so the app stays consistent, accessible,
responsive and maintainable as it grows.

> **Golden rules**
>
> 1. **Reusable components first, DRY always.** Never duplicate UI, styling or logic that can be extracted into a reusable component, hook, utility or shared function.
> 2. **Design system before features.** No page is built with one-off UI while an existing (or extractable) component can do the job. The showcase page (`/` for now) is the living reference — if it's not in the showcase, don't use it in a feature; if you build something new, add it to the showcase.
> 3. **Tokens only.** Colors are never hardcoded. Every color comes from a semantic token defined in `src/index.css`, in both light and dark themes.
> 4. **Responsive & fluid by default.** Design mobile-first; prefer fluid sizing (`clamp()`) over breakpoint jumps where appropriate.
> 5. **Accessible by default.** Keyboard operability, focus visibility, labels, contrast and reduced motion are not optional.

---

## 1. Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Framework  | React 19 + TypeScript (strict, `verbatimModuleSyntax`) |
| Build      | Vite + Vike (SSG pre-rendering)               |
| Styling    | Tailwind CSS v4 (CSS-first config in `src/index.css`) |
| Primitives | Radix UI (dialog, dropdown-menu, popover, tabs, switch, checkbox, radio-group, tooltip, select, accordion) |
| Rich Text  | Tiptap (headless, ProseMirror-based) — `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder` |
| Upload     | react-dropzone (drag-and-drop file selection) |
| Icons      | lucide-react                                   |
| Class util | `cn()` = `clsx` + `tailwind-merge` (`src/lib/utils.ts`) |
| Package mgr | pnpm                                          |

Do not add another styling system, UI kit or icon library without replacing this section of the rules first.

## 2. Project structure

```
├── pages/             # Vike page routes (SSG pre-rendering)
│   ├── +config.ts     # Vike global config
│   ├── +onBeforePrerenderStart.ts
│   ├── +onRenderHtml.tsx
│   ├── +onRenderClient.tsx
│   └── +Page.tsx      # Main page entry
├── src/
│   ├── components/
│   │   ├── ui/            # Reusable, app-agnostic primitives (Button, Input, …)
│   │   │   ├── index.ts   # Barrel export — the public API of the design system
│   │   │   └── *.tsx      # One component per file
│   │   ├── theme/         # Theme provider, toggle, mode switch
│   │   ├── settings/      # Settings panel, provider, context (Sheet-based)
│   │   └── seo/           # SEO components (structured data schemas)
│   ├── lib/               # Pure utilities & helpers (no React UI): cn(), format(), i18n(), string()…
│   ├── hooks/             # Shared React hooks (use* files)
│   ├── pages/             # Route-level pages composed ONLY from ui primitives
│   │   └── showcase/      # The design-system reference page
│   ├── App.tsx            # App shell: providers + layout
│   ├── index.css          # Design tokens (single source of truth)
│   └── main.tsx
├── public/            # Static assets (robots.txt, sitemap.xml, images)
└── vite.config.ts     # Vite + Vike config
```

**Where things go**

- New primitive → `components/ui/<name>.tsx` + barrel export + showcase entry.
- New shared logic → `lib/` (pure) or `hooks/` (stateful).
- New screen → `pages/<name>/+Page.tsx`, composed from `ui/`.
- Anything used by ≥ 2 pages must live outside the pages.
- SEO schemas → `components/seo/`.

## 3. Naming conventions

- Files: `kebab-case.tsx` (`date-picker.tsx`). Components/hooks/utils inside: named exports only (no default exports except `App.tsx`).
- Components & types: `PascalCase` (`DatePickerProps`).
- Hooks: `useSomething`. Booleans read as predicates: `isLoading`, `hasError`, `canSubmit`.
- Constants: `SCREAMING_SNAKE_CASE`.
- Props: extend native/Radix props instead of redefining them (`ComponentProps<'button'>`, `ComponentProps<typeof X>`). Never omit accessibility props like `aria-*` from a public component's type.
- CSS tokens: `--kebab-case`, grouped semantically (`--success-text`, not `--green-7`).

## 4. Component architecture

- Function declarations (not arrow consts), typed props interface exported alongside.
- React 19 style: accept `ref` through normal props — no `forwardRef`.
- One primary component per file; small private helpers may live in the same file if they're only used there.
- Compound components for multi-part UI (`Card` + `CardHeader`…, `Dialog` + `DialogTitle`…) — never a single mega-component with dozens of layout props.
- Controlled first: value/onChange pairs. Use internal state only when a sensible uncontrolled default exists (`defaultValue`, `defaultChecked`, `defaultOpen`).
- Variants via plain token maps (see `button-variants.ts`) — no class-string soup inside JSX conditionals.
- A component must handle every state it can appear in: rest, hover, focus-visible, active, disabled, loading (async triggers), error/invalid (form controls), selected (toggles/rows).
- Wrap complex widget behavior with Radix primitives rather than hand-rolling focus traps, portals or keyboard nav.

## 5. Tailwind CSS usage

- Utility classes inline in TSX; extract to `cn()` when conditional.
- **Never hardcode colors** (`text-zinc-500` ✗ → `text-fg-muted` ✓). Raw palette values (`brand-500`) exist only in `index.css` and gradient brand marks.
- No dynamic class construction (`class={`rounded-${r}`}` ✗) — Tailwind compiles statically; use explicit maps/lookups.
- Arbitrary values are allowed for one-offs (e.g. `max-h-[calc(100dvh-2rem)]`) but if a value repeats 3+ times it becomes a token or component.
- Keep class order roughly: layout → box model → typography → visual → state variants. Run Prettier with `prettier-plugin-tailwindcss` to enforce automatically.
- Prefer existing spacing steps (`gap-4`) over arbitrary ones (`gap-[17px]`).

### Focus ring pattern (copy exactly)

```tsx
'outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
```

Form fields use their field pattern instead:

```tsx
'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25'
```

## 6. Theming

- Light values live under `:root`, dark overrides under `.dark` in `src/index.css`; both are mapped into utilities via `@theme inline`.
- Components must work in both themes **with zero dark-mode conditionals**. If you need `dark:` in a component, you probably need a new semantic token instead.
- Adding a color:
  1. Add raw value(s) under `@theme` (only for new scales).
  2. Add semantic variables in `:root` **and** `.dark`.
  3. Map them in `@theme inline`.
  4. Document the token in the showcase Foundations section.
- Dark mode = class strategy on `<html>`. Only `ThemeProvider` mutates it; persistence key is `starter-kit-theme`.
- Verify every change in both themes — contrast failures in dark mode are release blockers.

## 7. Responsive design

- Write base styles for mobile, then enhance at breakpoints: `sm` 640 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1536.
- Headings/display text use the fluid scale (`text-display`, `text-h1`…`text-h4`, `text-lead`) which is built on `clamp()` — do not attach responsive font sizes to headings manually.
- Page gutters come from `container-page` (also fluid). Section rhythm: `space-y-16 lg:space-y-20` between major blocks.
- Grids collapse gracefully (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — content never scrolls horizontally except data tables, which get a scroll container (`Table` already provides one).
- Interactive targets ≥ 40px on touch layouts.
- Test at 360, 768, 1024, 1440 and 1920px widths before considering UI done.

## 8. Typography

- Scale: `text-xs` `.75rem` · `sm` `.875rem` · `base` `1rem` · `lg` `1.125rem` + fluid `lead/h4/h3/h2/h1/display`. Nothing else without adding a token.
- Weights: 400 body · 500 emphasis/buttons · 600 subheads/badges · 700 headings. Don't go heavier.
- Sentence case everywhere in UI copy (including buttons); ALL CAPS only via `uppercase` tracking-wider micro-labels (table headers, dropdown group labels).
- Numbers: `formatCurrency()` + `tabular-nums`, right-aligned in tables. Dates: `formatDate()` only — never hand-format. All formatters live in `lib/format.ts` and default to the current locale from `lib/i18n.ts`.
- Long text gets `text-balance` (headings) or a readable measure (`max-w-prose` / `max-w-sm`).

## 9. Spacing & shape

- 4px grid: use Tailwind steps (`1=4px` … `16=64px`). Component paddings: dense `p-3`, default `p-5 sm:p-6`, roomy `p-6 sm:p-8`.
- Label→control gap `gap-1.5`; between form fields `space-y-5`; demo/card stacks `gap-4`.
- Radius ladder: `rounded-md` small controls · `rounded-lg` buttons/inputs · `rounded-xl` menus/popovers · `rounded-2xl` cards/dialogs · `rounded-full` badges/pills.
- Elevation: structure = borders (`border-border`); floating layers = shadows (`shadow-lg/xl`) + border; never stack multiple shadows ad hoc.

## 10. Accessibility

- Semantic HTML first (`button`, `label`, `nav`, `table`…); Radix handles composite-widget semantics.
- Every input has an associated label — either `<Field label>` (preferred; wires `htmlFor`, `aria-describedby`, hint/error ids automatically) or an explicit `<Label htmlFor>`.
- Errors: rendered via `Field error` with `role="alert"`; set `invalid` (or let `Field` propagate it) so controls show `aria-invalid`.
- Icon-only buttons require `aria-label`. Decorative icons get `aria-hidden="true"`.
- Async status changes surface through polite/assertive live regions (`Spinner` uses `role="status"`; validation errors use alerts).
- Honor `prefers-reduced-motion` (global reset already does; don't add essential info conveyed only by animation).
- Contrast: ≥ 4.5:1 body text, ≥ 3:1 large text/UI boundaries — in both themes.

## 11. Forms & validation

- Controlled inputs owned by the page/component; single source of truth per form.
- Validate on submit; after first submit, clear a field's error as the user fixes it (see `FormsSection` example).
- Rules of thumb:
  - Required → mark with `required` + red asterisk in `Field`.
  - Format fields (`email`, number ranges) → validate with regex/comparison, message states what's wrong **and** what's expected ("Enter a valid email address.").
  - Never disable submit because the form is invalid — allow the click so users see all errors at once. Disable only while submitting.
- Submitting shows `loading` on the button and keeps its label ("Saving…"); success/failure feedback uses `Alert`, never `window.alert`.
- When a form outgrows ~6 fields or needs async/field-level validation, adopt react-hook-form + zod (decide once, then use everywhere).

## 12. DRY — reuse checklist (mandatory)

Before writing any UI code:

1. Search `components/ui/index.ts` for an existing primitive.
2. If close but not exact — extend it (new variant/prop), don't fork a copy.
3. Second occurrence of any UI pattern → extract into a component. Third occurrence of logic → extract into `lib/` or `hooks/`.
4. Copy-pasting more than a couple of utility lines is a smell; ask "what's the abstraction?"
5. Pages compose primitives; they contain layout + business logic, not raw `<button>`/`<input>` elements (trivial anchors with `buttonVariants()` allowed).

A reusable component is "done" only when it has: full prop typing ✔ both themes verified ✔ all applicable states ✔ responsive ✔ keyboard/a11y verified ✔ showcased on the showcase page ✔ exported from the barrel ✔.

## 13. Consistent UI & error handling

- Loading: skeleton mirrors final layout for page/data loads; `Spinner`/button `loading` for actions; `Progress` only with known progress.
- Empty: `EmptyState` with icon, one-line title, short description, single primary action.
- Error: `ErrorState` (views) with retry; `Alert danger` (inline/contextual); `Toast` notifications via `useToast()` (auto-dismiss after 5 seconds).
- Confirm: `useConfirm()` from `confirm-dialog` for destructive actions — returns a promise resolving to `boolean`.
- Optimistic updates must be revertible; otherwise show pending state until confirmed.
- All async flows have three renderings handled explicitly: loading, empty, error — never just success.

## 14. Animations

- Prefer CSS properties (`translate`, `scale`, `opacity`) over `transform` in keyframes — Tailwind v4 utilities use `translate`/`scale`/`rotate` properties which don't stack with `transform`.
- Entry/exit animations: `animate-zoom-in` / `animate-fade-out` for popovers, `animate-slide-up-fade` for content tabs, `animate-zoom-in` for checkbox indicators.
- Duration: 150ms for micro-interactions (hover, focus), 200ms for content transitions.
- Honor `prefers-reduced-motion` (global reset handles this).

## 15. Components reference

| Component | Location | Notes |
| --- | --- | --- |
| Select | `ui/select.tsx` | Radix-based compound (Select → SelectTrigger → SelectContent → SelectItem). Never use native `<option>`. |
| MultiSelect | `ui/multi-select.tsx` | Popover + search + chips. Accepts `options: { value, label }[]`. |
| Toast | `ui/toast.tsx` | `useToast()` returns `{ success, info, warning, danger }`. Provider required at root. |
| Confirm | `ui/confirm-dialog.tsx` | `useConfirm()` returns `(opts) => Promise<boolean>`. Provider required at root. |
| Settings | `settings/` | Sheet panel with primary color, font, font size. Provider required at root. |
| RichTextEditor | `ui/rich-text-editor.tsx` | Tiptap-based. Controlled `value`/`onValueChange`. Styled via `.tiptap` in `index.css`. |
| Accordion | `ui/accordion.tsx` | Radix-based compound. Single/multiple expand, collapsible. |
| Upload | `ui/upload.tsx` | react-dropzone-based. Drag-and-drop + click. Shows selected files with hover feedback, previews, rejection errors. |
| Config | `config.ts` | Centralized env access via `config.app.*` and `config.meta.*`. All env vars use `VITE_` prefix. |

- `pnpm lint` and `pnpm build` must pass with zero errors before committing.
- TypeScript strict: no `any` (use `unknown` + narrowing), no non-null assertions outside tests, exhaustive switch handling.
- ESLint rules are law — fix the code, don't weaken the rule, unless updating these docs together with it.
- Keep diffs focused; no drive-by refactors mixed into feature commits.

## 16. Code quality gates

- `pnpm lint` and `pnpm build` must pass with zero errors before committing.
- TypeScript strict: no `any` (use `unknown` + narrowing), no non-null assertions outside tests, exhaustive switch handling.
- ESLint rules are law — fix the code, don't weaken the rule, unless updating these docs together with it.
- Keep diffs focused; no drive-by refactors mixed into feature commits.

## 17. Scalability notes

- Router: when real routes arrive, keep `pages/*` lazy-loaded and preserve this showcase route untouched.
- State: local state by default; lift only when shared; introduce a server-state lib (TanStack Query) when real APIs land; avoid global stores for UI-only concerns.
- Performance: don't memoize prematurely; virtualize lists > 200 rows later, not now.
- i18n-ready: user-facing strings go through `translate()` / `useTranslation()` from `lib/i18n.ts` with `{{param}}` interpolation; dates/numbers/currency always via Intl helpers in `lib/format.ts` (which use `getLocale()`).

## 18. SEO & Pre-rendering

This project uses **Vike SSG** (Static Site Generation) for pre-rendering HTML at build time. All pages are pre-rendered and deployable to static hosts.

### Page Structure

```
pages/
├── +config.ts                    # Vike global config (prerender: true)
├── +onBeforePrerenderStart.ts    # URL list for pre-rendering
├── +onRenderHtml.tsx             # Server-side HTML rendering
├── +onRenderClient.tsx           # Client-side hydration
├── +Head.tsx                     # Per-page meta tags (optional)
└── +Page.tsx                     # Page component (renders App)
```

### Adding a New Page

1. Create `pages/<route>/+Page.tsx` with the page component
2. Create `pages/<route>/+config.ts` with route config
3. Add the route to `pages/+onBeforePrerenderStart.ts` for pre-rendering
4. Update `public/sitemap.xml` with the new URL

### SEO Meta Tags

Every page **must** have:
- `<title>` — 50-60 characters, unique per page
- `<meta name="description">` — 150-160 characters, unique per page
- `<link rel="canonical">` — full URL
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`)

Meta tags are set in `+onRenderHtml.tsx` (for static values) or via `+Head.tsx` (for dynamic per-page values).

### Structured Data (JSON-LD)

Use JSON-LD for rich snippets. Current schemas:
- `src/components/seo/organization-schema.ts` — Organization/SoftwareSourceCode schema

When adding new content types (products, articles, FAQs), create a new schema file in `src/components/seo/`.

### Static Files

- `public/robots.txt` — Allow all crawlers, reference sitemap
- `public/sitemap.xml` — All pre-rendered URLs
- `public/og-default.png` — Default social share image (1200×630px)

### Build & Verify

```bash
pnpm build          # Pre-render HTML to dist/client/
pnpm preview        # Serve pre-rendered site locally
```

Verify: view page source in browser — all content must be in initial HTML (no empty `<div id="root">`).

---

## Definition of done (any UI task)

- [ ] Uses/reuses design-system components; no duplicated UI or logic
- [ ] Semantic tokens only — works in light **and** dark themes
- [ ] Responsive 360px → 1920px, fluid where appropriate
- [ ] All interactive states implemented (hover/focus/active/disabled/loading/error)
- [ ] Accessible: labels, focus order, keyboard, live regions, contrast
- [ ] `pnpm lint` + `pnpm build` clean
- [ ] Showcase page updated if anything about the system changed
- [ ] SEO: unique `<title>`, `<meta description>`, canonical URL, OG tags present
