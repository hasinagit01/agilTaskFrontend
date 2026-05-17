import api from './api'

export const userService = {
  search(query) {
    return api.get('/users/search', { params: { q: query } })
  },
}
