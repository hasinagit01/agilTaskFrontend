import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('@/services/auth.service', () => ({
  authService: {
    login:    vi.fn(),
    register: vi.fn(),
    logout:   vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({
    success: vi.fn(),
    error:   vi.fn(),
    info:    vi.fn(),
  }),
}))

import { authService } from '@/services/auth.service'

const MOCK_USER  = { id: 1, email: 'test@example.com' }
const MOCK_TOKEN = 'jwt-token-abc'

describe('auth.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== État initial =====
  describe('état initial', () => {
    it('user et token sont null', () => {
      const store = useAuthStore()
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
    })

    it('isLoggedIn est false', () => {
      const store = useAuthStore()
      expect(store.isLoggedIn).toBe(false)
    })
  })

  // ===== login() =====
  describe('login()', () => {
    it('stocke user et token en cas de succès', async () => {
      authService.login.mockResolvedValue({ user: MOCK_USER, token: MOCK_TOKEN })

      const store  = useAuthStore()
      const result = await store.login({ email: MOCK_USER.email, password: '123456' })

      expect(result.success).toBe(true)
      expect(store.user).toEqual(MOCK_USER)
      expect(store.token).toBe(MOCK_TOKEN)
      expect(store.isLoggedIn).toBe(true)
    })

    it('ne modifie pas l\'état en cas d\'erreur', async () => {
      authService.login.mockRejectedValue({ message: 'Identifiants invalides' })

      const store  = useAuthStore()
      const result = await store.login({ email: 'bad@example.com', password: 'wrong' })

      expect(result.success).toBe(false)
      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoggedIn).toBe(false)
    })

    it('remet loading à false après l\'appel', async () => {
      authService.login.mockResolvedValue({ user: MOCK_USER, token: MOCK_TOKEN })

      const store = useAuthStore()
      await store.login({ email: MOCK_USER.email, password: '123456' })

      expect(store.loading).toBe(false)
    })
  })

  // ===== clearAuth() =====
  describe('clearAuth()', () => {
    it('efface user, token et passe isLoggedIn à false', async () => {
      authService.login.mockResolvedValue({ user: MOCK_USER, token: MOCK_TOKEN })

      const store = useAuthStore()
      await store.login({ email: MOCK_USER.email, password: '123456' })
      store.clearAuth()

      expect(store.user).toBeNull()
      expect(store.token).toBeNull()
      expect(store.isLoggedIn).toBe(false)
    })
  })

  // ===== isLoggedIn =====
  describe('isLoggedIn', () => {
    it('est false si seulement le token est présent', async () => {
      authService.login.mockResolvedValue({ user: MOCK_USER, token: MOCK_TOKEN })
      const store = useAuthStore()
      await store.login({ email: MOCK_USER.email, password: '123456' })

      store.clearAuth()
      store.setAuth(null, MOCK_TOKEN)

      expect(store.isLoggedIn).toBe(false)
    })

    it('est false si seulement user est présent', async () => {
      const store = useAuthStore()
      store.setAuth(MOCK_USER, null)

      expect(store.isLoggedIn).toBe(false)
    })

    it('est true si user ET token sont présents', () => {
      const store = useAuthStore()
      store.setAuth(MOCK_USER, MOCK_TOKEN)

      expect(store.isLoggedIn).toBe(true)
    })
  })
})
