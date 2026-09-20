import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const THEME_KEY = 'ae-selected-theme'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return window.localStorage.getItem(THEME_KEY) || ''
    } catch {
      return ''
    }
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme) root.setAttribute('data-theme', theme)
    else root.removeAttribute('data-theme')
    try {
      if (theme) window.localStorage.setItem(THEME_KEY, theme)
      else window.localStorage.removeItem(THEME_KEY)
    } catch {}
    root.classList.add('ae-theme-anim')
    const t = window.setTimeout(() => root.classList.remove('ae-theme-anim'), 520)
    return () => window.clearTimeout(t)
  }, [theme])

  const updateTheme = useCallback((value) => setTheme(value), [])

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}