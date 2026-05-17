import { defineStore } from 'pinia'
import { ref } from 'vue'
import { boardService } from '@/services/board.service'
import { useNotificationStore } from './notification.store'

export const useBoardStore = defineStore('board', () => {
  const boards = ref([])
  const currentBoard = ref(null)
  const loading = ref(false)

  async function fetchBoards() {
    loading.value = true
    try {
      const result = await boardService.getAll()
      boards.value = result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des boards')
    } finally {
      loading.value = false
    }
  }

  async function fetchBoard(boardId) {
    loading.value = true
    try {
      const result = await boardService.getById(boardId)
      currentBoard.value = result.data
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Board introuvable')
      return null
    } finally {
      loading.value = false
    }
  }

  async function createBoard(name) {
    try {
      const result = await boardService.create({ name })
      boards.value.push(result.data)
      useNotificationStore().success('Board créé avec succès')
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la création du board')
      return null
    }
  }

  async function updateBoard(boardId, name) {
    try {
      const result = await boardService.update(boardId, { name })
      const idx = boards.value.findIndex(b => b.id === boardId)
      if (idx !== -1) boards.value[idx] = result.data
      if (currentBoard.value?.id === boardId) currentBoard.value = result.data
      useNotificationStore().success('Board mis à jour')
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la mise à jour')
      return null
    }
  }

  async function removeBoard(boardId) {
    try {
      await boardService.remove(boardId)
      boards.value = boards.value.filter(b => b.id !== boardId)
      if (currentBoard.value?.id === boardId) currentBoard.value = null
      useNotificationStore().success('Board supprimé')
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la suppression')
      return false
    }
  }

  return {
    boards, currentBoard, loading,
    fetchBoards, fetchBoard, createBoard, updateBoard, removeBoard,
  }
})
