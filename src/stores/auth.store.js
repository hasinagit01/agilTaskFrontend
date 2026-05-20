import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import { decodeJWT } from '@/utils/jwt'
import { STORAGE_KEYS, MESSAGES } from '@/constants'
import { useNotificationStore } from './notification.store'

let _refreshTimer = null

export const useAuthStore = defineStore('auth', () => {
  // ===== State =====
  const user    = ref(null)
  const token   = ref(null)
  const loading = ref(false)

  // ===== Getters =====
  const isLoggedIn   = computed(() => !!token.value && !!user.value)
  const currentUser  = computed(() => user.value)
  const userInitials = computed(() => {
    const u = user.value
    if (u?.firstname && u?.name) {
      return (u.firstname[0] + u.name[0]).toUpperCase()
    }
    if (!u?.email) return '?'
    return u.email[0].toUpperCase()
  })

  // ===== Refresh automatique =====
  function _scheduleRefresh(tokenValue) {
    if (_refreshTimer) clearTimeout(_refreshTimer)
    const payload = decodeJWT(tokenValue)
    if (!payload?.exp) return
    const msUntilExpiry = payload.exp * 1000 - Date.now()
    const refreshIn = msUntilExpiry - 5 * 60 * 1000 // 5 min avant expiry
    if (refreshIn <= 0) return
    _refreshTimer = setTimeout(_doRefresh, refreshIn)
  }

  async function _doRefresh() {
    try {
      const newToken = await authService.refresh()
      token.value = newToken
      _scheduleRefresh(newToken)
    } catch {
      clearAuth()
    }
  }

  // ===== Actions =====
  function setAuth(userData, tokenValue) {
    user.value  = userData
    token.value = tokenValue
    if (tokenValue) _scheduleRefresh(tokenValue)
  }

  function clearAuth() {
    if (_refreshTimer) { clearTimeout(_refreshTimer); _refreshTimer = null }
    user.value  = null
    token.value = null
  }

  function init() {
    if (token.value) _scheduleRefresh(token.value)
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
    clearAuth()
    notifStore.info(MESSAGES.LOGOUT_SUCCESS)
  }

  function updateUser(patch) {
    if (user.value) user.value = { ...user.value, ...patch }
  }

  return {
    user, token, loading,
    isLoggedIn, currentUser, userInitials,
    setAuth, clearAuth, init, login, register, logout, updateUser,
  }
}, {
  persist: {
    key: STORAGE_KEYS.AUTH_STORE,
    paths: ['user', 'token'],
  },
})
