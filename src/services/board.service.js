import api from './api.js'

export const boardService = {
  getAll({ page = 1, limit = 10 } = {}) {
    return api.get('/boards/', { params: { page, limit } })
  },
  getById(boardId) {
    return api.get(`/boards/${boardId}`)
  },
  create(data) {
    return api.post('/boards/', data)
  },
  update(boardId, data) {
    return api.put(`/boards/${boardId}`, data)
  },
  remove(boardId) {
    return api.delete(`/boards/${boardId}`)
  },
}
