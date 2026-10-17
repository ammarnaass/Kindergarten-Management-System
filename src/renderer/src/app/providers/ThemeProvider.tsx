import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api } from '@/lib/api'

export type ActiveTheme = 'light' | 'dark' | 'system'
export type AccentColor = 'blue' | 'green' | 'purple' | 'navy'

interface ThemeContextValue {
  theme: ActiveTheme
  accentColor: AccentColor
  setTheme: (theme: ActiveTheme) => void
  setAccentColor: (accent: AccentColor) => void
  toggleTheme: () => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ActiveTheme>(() => {
    return (localStorage.getItem('rawdati_theme') as ActiveTheme) || 'light'
  })
  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem('rawdati_accent') as AccentColor) || 'blue'
  })
  const [isDark, setIsDark] = useState<boolean>(false)

  // 1. Apply theme to HTML root element with smooth 250ms transition
  const applyTheme = useCallback((currentTheme: ActiveTheme, currentAccent: AccentColor, withTransition = false) => {
    const root = document.documentElement
    let dark = false

    if (currentTheme === 'dark') {
      dark = true
    } else if (currentTheme === 'system') {
      dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    if (withTransition) {
      root.classList.add('transition-theme')
      setTimeout(() => root.classList.remove('transition-theme'), 250)
    }

    if (dark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    root.setAttribute('data-accent', currentAccent)
    setIsDark(dark)
  }, [])

  // 2. Initial load from database settings
  useEffect(() => {
    applyTheme(theme, accentColor, false)

    api.settings.getAll()
      .then((settings) => {
        if (!settings) return
        const dbTheme = (settings['appearance.activeTheme'] as ActiveTheme) || 'light'
        const dbAccent = (settings['appearance.accentColor'] as AccentColor) || 'blue'

        setThemeState(dbTheme)
        setAccentColorState(dbAccent)
        localStorage.setItem('rawdati_theme', dbTheme)
        localStorage.setItem('rawdati_accent', dbAccent)
        applyTheme(dbTheme, dbAccent, false)
      })
      .catch(() => {})
  }, [applyTheme])

  // 3. Listen to OS system color changes when theme is 'system'
  useEffect(() => {
    if (theme !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system', accentColor, true)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, accentColor, applyTheme])

  const setTheme = useCallback((newTheme: ActiveTheme) => {
    setThemeState(newTheme)
    localStorage.setItem('rawdati_theme', newTheme)
    applyTheme(newTheme, accentColor, true)
    api.settings.set('appearance.activeTheme', newTheme).catch(() => {})
  }, [accentColor, applyTheme])

  const setAccentColor = useCallback((newAccent: AccentColor) => {
    setAccentColorState(newAccent)
    localStorage.setItem('rawdati_accent', newAccent)
    applyTheme(theme, newAccent, true)
    api.settings.set('appearance.accentColor', newAccent).catch(() => {})
  }, [theme, applyTheme])

  const toggleTheme = useCallback(() => {
    const nextTheme: ActiveTheme = isDark ? 'light' : 'dark'
    setTheme(nextTheme)
  }, [isDark, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, accentColor, setTheme, setAccentColor, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
