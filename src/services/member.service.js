import api from './api.js'

export const memberService = {
  getAll(boardId) {
    return api.get(`/boards/${boardId}/members/`)
  },
  add(boardId, data) {
    return api.post(`/boards/${boardId}/members/`, data)
  },
  updateRole(boardId, userId, data) {
    return api.put(`/boards/${boardId}/members/${userId}`, data)
  },
  remove(boardId, userId) {
    return api.delete(`/boards/${boardId}/members/${userId}`)
  },
}
