import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { STORAGE_KEYS, MESSAGES } from '@/constants'
import { useNotificationStore } from './notification.store'

export const useAuthStore = defineStore('auth', () => {
  // ===== State =====
  const user    = ref(null)
  const token   = ref(null)
  const loading = ref(false)

  // ===== Getters =====
  const isLoggedIn   = computed(() => !!token.value && !!user.value)
  const isAdmin      = computed(() => false)
  const currentUser  = computed(() => user.value)
  const userInitials = computed(() => {
    if (!user.value?.email) return '?'
    return user.value.email[0].toUpperCase()
  })

  // ===== Actions =====
  function setAuth(userData, tokenValue) {
    user.value  = userData
    token.value = tokenValue
  }

  function clearAuth() {
    user.value  = null
    token.value = null
  }

  async function login(credentials) {
    const notifStore = useNotificationStore()
    loading.value = true
    try {
      const data = await authService.login(credentials)
      setAuth(data.user, data.token)
      notifStore.success(MESSAGES.LOGIN_SUCCESS)
      return { success: true }
    } catch (error) {
      notifStore.error(error.message || MESSAGES.ERROR_GENERIC)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  async function register(userData) {
    const notifStore = useNotificationStore()
    loading.value = true
    try {
      const data = await authService.register(userData)
      setAuth(data.user, data.token)
      notifStore.success(MESSAGES.REGISTER_SUCCESS)
      return { success: true }
    } catch (error) {
      notifStore.error(error.message || MESSAGES.ERROR_GENERIC)
      return { success: false, error }
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    const notifStore = useNotificationStore()
    try {
      await authService.logout()
    } finally {
      clearAuth()
      notifStore.info(MESSAGES.LOGOUT_SUCCESS)
    }
  }

  async function fetchCurrentUser() {
    // L'utilisateur est reconstruit depuis le JWT stocké — pas d'endpoint /users/me
  }

  return {
    user, token, loading,
    isLoggedIn, isAdmin, currentUser, userInitials,
    login, register, logout, fetchCurrentUser, clearAuth,
  }
}, {
  persist: {
    key: STORAGE_KEYS.AUTH_STORE,
    paths: ['user', 'token'],
  },
})
