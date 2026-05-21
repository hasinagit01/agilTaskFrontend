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

const APP_TITLE = 'Agil Task'

const routes = [
  // ===== Routes publiques =====
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'auth', guestOnly: true, title: 'Connexion' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'auth', guestOnly: true, title: 'Inscription' },
  },

  // ===== Routes protégées =====
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, title: 'Mes boards' },
  },
  {
    path: '/boards/:id',
    name: 'BoardDetail',
    component: BoardDetail,
    meta: { requiresAuth: true }, // titre dynamique géré dans le composant
  },
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { title: 'À propos' },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, title: 'Mon profil' },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true, title: 'Paramètres' },
  },

  // ===== Pages d'erreur =====
  {
    path: '/error',
    name: 'Error',
    component: ErrorPage,
    meta: { title: 'Erreur' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page introuvable' },
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

// ===== Titre dynamique =====
router.afterEach((to) => {
  const pageTitle = to.meta?.title
  document.title = pageTitle ? `${pageTitle} · ${APP_TITLE}` : APP_TITLE
})

// ===== Navigation Guards =====
router.beforeEach((to, _from, next) => {
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

export default router
