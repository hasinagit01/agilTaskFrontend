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
    if (!error.response) {
      router.replace({ name: 'Error', query: { code: 'network' } })
      return new Promise(() => {})
    }

    const status = error.response.status

    if (status === HTTP_STATUS.UNAUTHORIZED) {
      if (!_redirectingToLogin) {
        _redirectingToLogin = true
        const authStore = useAuthStore()
        authStore.clearAuth()
        await router.replace({ name: 'Login' })
        _redirectingToLogin = false
      }
      return new Promise(() => {})
    }

    if (status === HTTP_STATUS.FORBIDDEN) {
      router.replace({ name: 'Error', query: { code: 403 } })
      return new Promise(() => {})
    }

    if (status === HTTP_STATUS.NOT_FOUND) {
      router.replace({ name: 'NotFound' })
      return new Promise(() => {})
    }

    if (status >= 500) {
      router.replace({ name: 'Error', query: { code: status } })
      return new Promise(() => {})
    }

    return Promise.reject({
      status,
      message: error.response?.data?.error || error.response?.data?.message || 'Erreur inconnue',
      data: error.response?.data || null,
    })
  },
)

export default api
