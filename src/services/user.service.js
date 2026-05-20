import api from './api'

export const userService = {
  search(query) {
    return api.get('/users/search', { params: { q: query } })
  },
  updateEmail(email) {
    return api.patch('/users/me', { email })
  },
  updatePassword(current_password, new_password) {
    return api.patch('/users/me/password', { current_password, new_password })
  },
  deleteAccount(password) {
    return api.delete('/users/me', { data: { password } })
  },
  updateProfile(firstname, name) {
    return api.patch('/users/me/profile', { firstname, name })
  },
}
