import api from './api.js'

function decodeJWT(token) {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload))
  } catch {
    return null
  }
}

export const authService = {
  async login({ email, password }) {
    const result = await api.post('/auth/login', { email, password })
    const access_token = result.data.access_token
    const payload = decodeJWT(access_token)
    const user = { id: parseInt(payload.sub), email: payload.email }
    return { user, token: access_token }
  },

  async register({ email, password }) {
    await api.post('/auth/register', { email, password })
    return authService.login({ email, password })
  },

  async logout() {
    return {}
  },
}
