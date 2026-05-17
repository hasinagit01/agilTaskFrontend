import api from './api.js'

export const columnService = {
  getAll(boardId) {
    return api.get(`/boards/${boardId}/columns/`)
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
  reorder(boardId, columnIds) {
    return api.patch(`/boards/${boardId}/columns/reorder`, { ordered_ids: columnIds })
  },
}
