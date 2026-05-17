import api from './api.js'

export const cardService = {
  getAll(boardId, columnId) {
    return api.get(`/boards/${boardId}/columns/${columnId}/cards/`)
  },
  getById(boardId, columnId, cardId) {
    return api.get(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`)
  },
  create(boardId, columnId, data) {
    return api.post(`/boards/${boardId}/columns/${columnId}/cards/`, data)
  },
  update(boardId, columnId, cardId, data) {
    return api.put(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`, data)
  },
  move(boardId, columnId, cardId, targetColumnId) {
    return api.patch(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/move`, {
      target_column_id: targetColumnId,
    })
  },
  remove(boardId, columnId, cardId) {
    return api.delete(`/boards/${boardId}/columns/${columnId}/cards/${cardId}`)
  },
  reorder(boardId, columnId, orderedIds) {
    return api.patch(`/boards/${boardId}/columns/${columnId}/cards/reorder`, {
      ordered_ids: orderedIds,
    })
  },
}
