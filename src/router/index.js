import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

// Lazy loading des pages
const Home        = () => import('@/pages/Home.vue')
const BoardDetail = () => import('@/pages/BoardDetail.vue')
const About       = () => import('@/pages/About.vue')
const Login       = () => import('@/pages/auth/Login.vue')
const Register    = () => import('@/pages/auth/Register.vue')
const Profile     = () => import('@/pages/Profile.vue')
const Settings    = () => import('@/pages/Settings.vue')
const NotFound    = () => import('@/pages/NotFound.vue')
const ErrorPage   = () => import('@/pages/Error.vue')

const routes = [
  // ===== Routes publiques =====
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth', guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'auth', guestOnly: true },
  },

  // ===== Routes protégées =====
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/boards/:id',
    name: 'BoardDetail',
    component: BoardDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true },
  },

  // ===== Routes admin =====
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('@/pages/NotFound.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/pages/NotFound.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },

  // ===== Pages d'erreur =====
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// ===== Navigation Guards =====
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
    return
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    next({ name: 'Home' })
    return
  }

  next()
})

export default router
