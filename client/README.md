# Starter Kit

A production-ready React component library and design system — built with React 19, TypeScript, Vite, Radix UI, and Tailwind CSS v4. It ships with a comprehensive showcase page that serves as the living reference for every primitive.

## Tech Stack

| Concern    | Choice |
|------------|--------|
| Framework  | React 19 + TypeScript (strict, `verbatimModuleSyntax`) |
| Build      | Vite |
| Styling    | Tailwind CSS v4 (CSS-first config in `src/index.css`) |
| Primitives | Radix UI (dialog, dropdown-menu, popover, tabs, switch, checkbox, radio-group, tooltip, select, accordion, toast) |
| Rich Text  | Tiptap (headless, ProseMirror-based) |
| Upload     | react-dropzone (drag-and-drop file selection) |
| Icons      | lucide-react |
| Utilities  | `cn()` = `clsx` + `tailwind-merge` |
| Package mgr | pnpm |

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint

# Preview production build
pnpm preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/            # Reusable, app-agnostic primitives (Button, Input, …)
│   │   ├── index.ts   # Barrel export — the public API of the design system
│   │   └── *.tsx      # One component per file
│   ├── theme/         # Theme provider, toggle, mode switch
│   └── settings/      # Settings panel, provider, context (Sheet-based)
├── lib/               # Pure utilities & helpers (cn(), format(), i18n(), string()…)
├── pages/             # Route-level pages composed ONLY from ui primitives
│   └── showcase/      # The design-system reference page
├── App.tsx            # App shell: providers + layout
├── index.css          # Design tokens (single source of truth)
└── main.tsx
```

## Features

- **37+ UI primitives** — Button, Input, Select, MultiSelect, Dialog, Sheet, Accordion, Tabs, Toast, Confirm, RichTextEditor, Upload, Table, Pagination, Spinner, Skeleton, Slider, Switch, Checkbox, RadioGroup, and more.
- **Theme system** — Light / dark mode with CSS custom properties and Tailwind v4 `@theme inline`. Dark mode is persisted via `localStorage`.
- **Brand personalization** — Switch primary colors dynamically (preset palettes + custom color picker) using OKLCH-based brand scale generation.
- **Typography settings** — Adjust font size scale, switch between Google Fonts, or upload custom fonts.
- **Rich text editing** — Tiptap-based editor with support for headings, lists, code, blockquotes, and more.
- **Drag-and-drop upload** — react-dropzone integration with previews and rejection handling.
- **Fully accessible** — Keyboard operability, focus rings, ARIA labels, live regions, and `prefers-reduced-motion` support.

## Component Reference

| Component | Location | Notes |
| --- | --- | --- |
| Select | `ui/select.tsx` | Radix-based compound (Select → SelectTrigger → SelectContent → SelectItem). |
| MultiSelect | `ui/multi-select.tsx` | Popover + search + chips. Accepts `options: { value, label }[]`. |
| Toast | `ui/toast.tsx` | `useToast()` returns `{ success, info, warning, danger }`. |
| Confirm | `ui/confirm-dialog.tsx` | `useConfirm()` returns `(opts) => Promise<boolean>`. |
| Settings | `settings/` | Sheet panel with primary color, font, font size. |
| RichTextEditor | `ui/rich-text-editor.tsx` | Tiptap-based. Controlled `value`/`onValueChange`. |
| Accordion | `ui/accordion.tsx` | Radix-based compound. Single/multiple expand, collapsible. |
| Upload | `ui/upload.tsx` | react-dropzone-based. Drag-and-drop + click. |

## Design Tokens

All colors, spacing, radii, shadows, typography, and motion are defined as CSS custom properties in `src/index.css`:

- **Raw palettes** — `@theme` block with OKLCH values for brand and neutral scales.
- **Semantic tokens** — `:root` / `.dark` blocks mapping raw values into meaningful names (`--primary`, `--fg-muted`, `--danger-soft`, etc.).
- **Tailwind mapping** — `@theme inline` maps semantic tokens into Tailwind utilities (`bg-background`, `text-fg`, `border-border`).
- **Fluid type** — Heading scale built on `clamp()` for smooth responsive scaling.
- **Motion** — 15+ named keyframe animations for dialogs, toasts, sheets, accordions, shimmer, and indeterminate progress.

## Rules

See `rules.md` for the full contract: architecture, naming conventions, Tailwind usage, theming, accessibility, forms, animations, and the definition of done.
