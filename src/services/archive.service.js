import api from './api.js'

export const archiveService = {
  archiveCard(boardId, columnId, cardId) {
    return api.patch(`/boards/${boardId}/columns/${columnId}/cards/${cardId}/archive`)
  },
  unarchiveCard(boardId, cardId) {
    return api.patch(`/boards/${boardId}/cards/${cardId}/unarchive`)
  },
  getArchivedCards(boardId) {
    return api.get(`/boards/${boardId}/archives/cards`)
  },
  archiveColumn(boardId, columnId) {
    return api.patch(`/boards/${boardId}/columns/${columnId}/archive`)
  },
  unarchiveColumn(boardId, columnId) {
    return api.patch(`/boards/${boardId}/columns/${columnId}/unarchive`)
  },
  getArchivedColumns(boardId) {
    return api.get(`/boards/${boardId}/archives/columns`)
  },
}
