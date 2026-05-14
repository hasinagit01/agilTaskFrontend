import axios from 'axios'
import { HTTP_STATUS } from '@/constants'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

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
      const authStore = useAuthStore()
      authStore.clearAuth()
      router.push('/login')
    }

    if (status === HTTP_STATUS.FORBIDDEN) {
      router.push('/')
    }

    return Promise.reject({
      status,
      message: error.response?.data?.message || 'Erreur inconnue',
      data: error.response?.data || null,
    })
  },
)

export default api
