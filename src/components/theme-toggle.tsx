'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-14 h-8 rounded-full bg-muted animate-pulse" />
    )
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background cursor-pointer ${
        isDark ? 'bg-accent' : 'bg-muted'
      }`}
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-background shadow-md transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-foreground" />
        ) : (
          <Sun className="h-3 w-3 text-foreground" />
        )}
      </div>
    </button>
  )
}