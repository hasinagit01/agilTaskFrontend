import { inject, computed } from 'vue'
import { STORAGE_KEYS } from '@/constants'

/**
 * Composable pour la gestion du thème (clair/sombre)
 */
export function useTheme() {
  const theme       = inject('theme')
  const toggleTheme = inject('toggleTheme')

  const isDark = computed(() => theme.value === 'dark')

  function setTheme(value) {
    if (theme && (value === 'light' || value === 'dark')) {
      theme.value = value
      localStorage.setItem(STORAGE_KEYS.THEME, value)
    }
  }

  return { theme, isDark, toggleTheme, setTheme }
}
