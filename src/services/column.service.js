import api from './api.js'

export const columnService = {
  getAll(boardId) {
    return api.get(`/boards/${boardId}/columns/`)
  },
  getById(boardId, columnId) {
    return api.get(`/boards/${boardId}/columns/${columnId}`)
  },
  create(boardId, data) {
    return api.post(`/boards/${boardId}/columns/`, data)
  },
  update(boardId, columnId, data) {
    return api.put(`/boards/${boardId}/columns/${columnId}`, data)
  },
  remove(boardId, columnId) {
    return api.delete(`/boards/${boardId}/columns/${columnId}`)
  },
  reorder(boardId, orderedIds) {
    return api.patch(`/boards/${boardId}/columns/reorder`, { ordered_ids: orderedIds })
  },
}
