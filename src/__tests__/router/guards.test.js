import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createWebHashHistory } from 'vue-router'
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth.store'

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({
    success: vi.fn(),
    error:   vi.fn(),
    info:    vi.fn(),
  }),
}))

vi.mock('@/services/auth.service', () => ({
  authService: {
    login:    vi.fn(),
    register: vi.fn(),
    logout:   vi.fn(),
  },
}))

// Composant minimal pour éviter le lazy-loading en test
const Stub = defineComponent({ template: '<div />' })

function createTestRouter() {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/login',       name: 'Login',       component: Stub, meta: { guestOnly: true } },
      { path: '/register',    name: 'Register',    component: Stub, meta: { guestOnly: true } },
      { path: '/',            name: 'Home',        component: Stub, meta: { requiresAuth: true } },
      { path: '/boards/:id',  name: 'BoardDetail', component: Stub, meta: { requiresAuth: true } },
      { path: '/profile',     name: 'Profile',     component: Stub, meta: { requiresAuth: true } },
      { path: '/about',       name: 'About',       component: Stub },
    ],
  })

  // Même logique que src/router/index.js
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (to.meta.guestOnly && authStore.isLoggedIn) {
      next({ name: 'Home' })
      return
    }
    next()
  })

  return router
}

describe('Navigation guards', () => {
  let router

  beforeEach(() => {
    setActivePinia(createPinia())
    router = createTestRouter()
  })

  // ===== Route protégée sans auth =====
  describe('requiresAuth — utilisateur non connecté', () => {
    it('redirige vers /login depuis /', async () => {
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('Login')
    })

    it('redirige vers /login depuis /boards/1', async () => {
      await router.push('/boards/1')
      expect(router.currentRoute.value.name).toBe('Login')
    })

    it('passe le redirect en query param', async () => {
      await router.push('/profile')
      expect(router.currentRoute.value.query.redirect).toBe('/profile')
    })
  })

  // ===== Route protégée avec auth =====
  describe('requiresAuth — utilisateur connecté', () => {
    beforeEach(() => {
      const authStore = useAuthStore()
      authStore.setAuth({ id: 1, email: 'test@example.com' }, 'jwt-token')
    })

    it('laisse passer vers /', async () => {
      await router.push('/')
      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('laisse passer vers /boards/:id', async () => {
      await router.push('/boards/5')
      expect(router.currentRoute.value.name).toBe('BoardDetail')
    })
  })

  // ===== Route guestOnly =====
  describe('guestOnly — utilisateur connecté', () => {
    beforeEach(() => {
      const authStore = useAuthStore()
      authStore.setAuth({ id: 1, email: 'test@example.com' }, 'jwt-token')
    })

    it('redirige vers / depuis /login', async () => {
      await router.push('/login')
      expect(router.currentRoute.value.name).toBe('Home')
    })

    it('redirige vers / depuis /register', async () => {
      await router.push('/register')
      expect(router.currentRoute.value.name).toBe('Home')
    })
  })

  // ===== Route publique =====
  describe('route publique', () => {
    it('laisse passer sans auth', async () => {
      await router.push('/about')
      expect(router.currentRoute.value.name).toBe('About')
    })
  })
})
