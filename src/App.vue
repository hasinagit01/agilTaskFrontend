<template>
  <v-app :theme="theme">
    <router-view />
  </v-app>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { STORAGE_KEYS } from '@/constants'

const theme = ref('light')

const toggleTheme = () => {
  const next = theme.value === 'light' ? 'dark' : 'light'
  theme.value = next
  localStorage.setItem(STORAGE_KEYS.THEME, next)
}

provide('theme', theme)
provide('toggleTheme', toggleTheme)

onMounted(() => {
  const saved = localStorage.getItem(STORAGE_KEYS.THEME)
  if (saved) {
    theme.value = saved
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    theme.value = 'dark'
  }
})
</script>
