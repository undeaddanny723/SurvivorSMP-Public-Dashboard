import { useEffect, useState } from 'react'
import { LS_KEYS } from '../lib/constants'

function readStoredTheme() {
  const storedTheme = localStorage.getItem(LS_KEYS.THEME)
  return storedTheme === 'light' ? 'light' : 'dark'
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => readStoredTheme())

  useEffect(() => {
    const root = document.documentElement

    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    localStorage.setItem(LS_KEYS.THEME, theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
