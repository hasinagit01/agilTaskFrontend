import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { ROUTES } from '@/constants'

/**
 * Composable d'authentification
 * Fournit un accès simplifié à l'état d'auth et aux actions
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router    = useRouter()
  const route     = useRoute()

  const isLoggedIn  = computed(() => authStore.isLoggedIn)
  const currentUser = computed(() => authStore.currentUser)
  const loading     = computed(() => authStore.loading)

  async function login(credentials) {
    const result = await authStore.login(credentials)
    if (result.success) {
      const redirect = route.query.redirect
      router.push(redirect ? String(redirect) : ROUTES.HOME)
    }
    return result
  }

  async function register(userData) {
    const result = await authStore.register(userData)
    if (result.success) {
      router.push(ROUTES.HOME)
    }
    return result
  }

  async function logout() {
    await authStore.logout()
    router.push(ROUTES.LOGIN)
  }

  function requireAuth() {
    if (!authStore.isLoggedIn) {
      router.push(ROUTES.LOGIN)
      return false
    }
    return true
  }

  return {
    isLoggedIn, currentUser, loading,
    login, register, logout, requireAuth,
  }
}
