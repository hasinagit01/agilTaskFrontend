import api from './api.js'

export const assigneeService = {
  assign(boardId, columnId, cardId, userId) {
    return api.post(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/assignees/${userId}`)
  },
  unassign(boardId, columnId, cardId, userId) {
    return api.delete(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/assignees/${userId}`)
  },
}
