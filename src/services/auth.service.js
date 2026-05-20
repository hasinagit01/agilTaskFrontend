import api from './api.js'

export const authService = {
  async login({ email, password }) {
    const result = await api.post('/auth/login', { email, password })
    const access_token = result.data.access_token
    const profile = await api.get('/users/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    const user = profile.data
    return { user, token: access_token }
  },

  async register({ email, password, firstname, name }) {
    await api.post('/auth/register', { email, password, firstname, name })
    return authService.login({ email, password })
  },

  async refresh() {
    const result = await api.post('/auth/refresh')
    return result.data.access_token
  },
}
