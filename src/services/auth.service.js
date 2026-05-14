import { STORAGE_KEYS } from '@/constants'

const MOCK_USERS_KEY = 'mock_users'
const MOCK_DELAY = 600

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getMockUsers() {
  return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '[]')
}

function saveMockUsers(users) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function generateToken(user) {
  return btoa(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 }))
}

// Compte admin par défaut toujours disponible
const DEFAULT_ADMIN = {
  id: 1,
  name: 'Admin',
  email: 'admin@demo.com',
  password: 'Admin123',
  role: 'admin',
}

export const authService = {
  async login({ email, password }) {
    await delay(MOCK_DELAY)

    const allUsers = [DEFAULT_ADMIN, ...getMockUsers()]
    const found = allUsers.find(u => u.email === email && u.password === password)

    if (!found) {
      return Promise.reject({ message: 'Email ou mot de passe incorrect.' })
    }

    const { password: _pwd, ...user } = found
    return { user, token: generateToken(user) }
  },

  async register({ name, email, password }) {
    await delay(MOCK_DELAY)

    const allUsers = [DEFAULT_ADMIN, ...getMockUsers()]
    if (allUsers.find(u => u.email === email)) {
      return Promise.reject({ message: 'Cet email est déjà utilisé.' })
    }

    const user = { id: Date.now(), name, email, role: 'user' }
    saveMockUsers([...getMockUsers(), { ...user, password }])
    return { user, token: generateToken(user) }
  },

  async logout() {
    await delay(200)
    return {}
  },

  async me() {
    await delay(200)
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH_STORE)
    if (!raw) return Promise.reject({ message: 'Non authentifié.' })
    const { user } = JSON.parse(raw)
    if (!user) return Promise.reject({ message: 'Non authentifié.' })
    return { user }
  },

  async forgotPassword({ email }) {
    await delay(MOCK_DELAY)
    const allUsers = [DEFAULT_ADMIN, ...getMockUsers()]
    if (!allUsers.find(u => u.email === email)) {
      return Promise.reject({ message: 'Aucun compte associé à cet email.' })
    }
    return {}
  },

  async resetPassword(_data) {
    await delay(MOCK_DELAY)
    return {}
  },
}
