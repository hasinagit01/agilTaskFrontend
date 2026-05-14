import { inject, computed } from 'vue'
import { STORAGE_KEYS } from '@/constants'

/**
 * Composable pour la gestion du thème (clair/sombre)
 */
export function useTheme() {
  const theme       = inject('theme')
  const toggleTheme = inject('toggleTheme')

  const isDark  = computed(() => theme.value === 'dark')
  const isLight = computed(() => theme.value === 'light')

  function setTheme(value) {
    if (theme && (value === 'light' || value === 'dark')) {
      theme.value = value
      localStorage.setItem(STORAGE_KEYS.THEME, value)
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME)
    if (saved) setTheme(saved)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }

  return { theme, isDark, isLight, toggleTheme, setTheme, initTheme }
}
