import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-context'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setMode } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      onClick={() => setMode(isDark ? 'light' : 'dark')}
    >
      {isDark ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
    </Button>
  )
}
