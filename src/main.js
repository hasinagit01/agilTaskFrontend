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
          primary: '#1976D2',
          secondary: '#424242',
          accent: '#82B1FF',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#F5F5F5',
          surface: '#FFFFFF',
        },
      },
      dark: {
        colors: {
          primary: '#2196F3',
          secondary: '#616161',
          accent: '#FF4081',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
          surface: '#1E1E1E',
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
