import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@/assets/styles/main.css'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary:    '#6366f1',
          secondary:  '#8b5cf6',
          accent:     '#a5b4fc',
          error:      '#ef4444',
          info:       '#3b82f6',
          success:    '#22c55e',
          warning:    '#f59e0b',
          background: '#f1f5f9',
          surface:    '#ffffff',
        },
      },
      dark: {
        colors: {
          primary:    '#818cf8',
          secondary:  '#a78bfa',
          accent:     '#c4b5fd',
          error:      '#f87171',
          info:       '#60a5fa',
          success:    '#4ade80',
          warning:    '#fbbf24',
          background: '#0f172a',
          surface:    '#1e293b',
        },
      },
    },
  },
  defaults: {
    VBtn:      { rounded: 'lg' },
    VCard:     { rounded: 'xl' },
    VTextField: { variant: 'outlined', density: 'compact' },
    VTextarea:  { variant: 'outlined', density: 'compact' },
    VSelect:    { variant: 'outlined', density: 'compact' },
    VList:      { density: 'compact', rounded: 'lg' },
    VListItem:  { rounded: 'lg' },
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

app.mount('#app')
