import api from './api.js'

export const activityService = {
  getBoardActivity(boardId) {
    return api.get(`/boards/${boardId}/activity`)
  },
}
