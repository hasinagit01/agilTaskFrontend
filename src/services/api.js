import axios from 'axios'
import { HTTP_STATUS } from '@/constants'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

// Verrou pour éviter plusieurs redirections simultanées vers /login (ex: appels parallèles tous en 401)
let _redirectingToLogin = false

// Instance Axios principale
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ===== Intercepteur de requête =====
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// ===== Intercepteur de réponse =====
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const status = error.response?.status

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      if (!_redirectingToLogin) {
        _redirectingToLogin = true
        const authStore = useAuthStore()
        authStore.clearAuth()
        await router.replace({ name: 'Login' })
        _redirectingToLogin = false
      }
      // Retourne une promesse en attente pour stopper la chaîne d'appels
      // (le composant sera détruit par la navigation, pas besoin de rejeter)
      return new Promise(() => {})
    }

    if (status === HTTP_STATUS.FORBIDDEN) {
      router.push({ name: 'Error', query: { code: 403 } })
    }

    if (status === HTTP_STATUS.NOT_FOUND) {
      router.push({ name: 'NotFound' })
    }

    if (status === HTTP_STATUS.SERVER_ERROR || status >= 500) {
      router.push({ name: 'Error', query: { code: 500 } })
    }

    if (!error.response) {
      // Pas de réponse du serveur : timeout ou réseau coupé
      router.push({ name: 'Error', query: { code: 'network' } })
    }

    return Promise.reject({
      status,
      message: error.response?.data?.error || error.response?.data?.message || 'Erreur inconnue',
      data: error.response?.data || null,
    })
  },
)

export default api
