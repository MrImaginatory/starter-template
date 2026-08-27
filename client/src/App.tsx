import { Settings } from 'lucide-react'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { SettingsPanel, SettingsProvider, useSettings } from '@/components/settings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmProvider } from '@/components/ui/confirm-dialog'
import { ToastProvider } from '@/components/ui/toast'
import { Tooltip } from '@/components/ui/tooltip'
import { socials } from '@/config/socials'
import { APP_NAME } from '@/lib/utils'
import { ShowcasePage } from '@/pages/showcase/showcase-page'

function HeaderActions() {
  const { setPanelOpen } = useSettings()
  return (
    <div className="flex items-center gap-2">
      <Badge variant="primary" className="hidden sm:inline-flex">
        Design System
      </Badge>
      <Tooltip content="Appearance settings" side="bottom">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open settings"
          onClick={() => setPanelOpen(true)}
        >
          <Settings className="size-4.5" aria-hidden="true" />
        </Button>
      </Tooltip>
      <ThemeToggle />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <SettingsProvider>
            <div className="flex min-h-dvh flex-col">
              <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
                <div className="container-page flex h-16 items-center justify-between gap-4">
                  <a
                    href="#"
                    className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-primary-fg shadow-xs"
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="size-4.5">
                        <path
                          d="M7 8h10M7 12h10M7 16h6"
                          stroke="currentColor"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    <span className="text-base font-semibold tracking-tight text-fg">{APP_NAME}</span>
                  </a>
                  <HeaderActions />
                </div>
              </header>

              <main className="flex-1">
                <ShowcasePage />
              </main>

              <footer className="border-t border-border">
                <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-fg-muted sm:flex-row">
                  <p>{APP_NAME} — built on its own design system.</p>
                  <div className="flex items-center gap-3">
                    <nav aria-label="Social links" className="flex items-center gap-1">
                      {socials.map(({ platform, label, url, icon: Icon }) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="inline-flex size-7 items-center justify-center rounded-md text-fg-subtle transition-colors hover:bg-muted hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                        >
                          <Icon className="size-3.5" />
                        </a>
                      ))}
                    </nav>
                    <span className="h-4 w-px bg-border" aria-hidden="true" />
                    <p className="text-xs text-fg-subtle">React 19 · Tailwind CSS v4 · Radix UI</p>
                  </div>
                </div>
              </footer>

              <SettingsPanel />
            </div>
          </SettingsProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
