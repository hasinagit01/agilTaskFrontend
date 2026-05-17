import api from './api.js'

export const labelService = {
  getAll(boardId) {
    return api.get(`/boards/${boardId}/labels/`)
  },
  create(boardId, data) {
    return api.post(`/boards/${boardId}/labels/`, data)
  },
  remove(boardId, labelId) {
    return api.delete(`/boards/${boardId}/labels/${labelId}`)
  },
  attach(boardId, columnId, cardId, labelId) {
    return api.post(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/labels/${labelId}`)
  },
  detach(boardId, columnId, cardId, labelId) {
    return api.delete(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/labels/${labelId}`)
  },
}
