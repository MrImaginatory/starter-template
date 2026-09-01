'use client'

import { ThemeProvider } from '@/components/theme/theme-provider'
import { ToastProvider } from '@/components/ui/toast'
import { ConfirmProvider } from '@/components/ui/confirm-dialog'
import { SettingsProvider } from '@/components/settings/settings-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <ConfirmProvider>
          <SettingsProvider>{children}</SettingsProvider>
        </ConfirmProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
