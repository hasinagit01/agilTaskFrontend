import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { boardService } from '@/services/board.service'
import { useNotificationStore } from './notification.store'

const PAGE_SIZE = 10

export const useBoardStore = defineStore('board', () => {
  const boards       = ref([])
  const currentBoard = ref(null)
  const loading      = ref(false)
  const total        = ref(0)
  const page         = ref(1)

  const hasMore = computed(() => boards.value.length < total.value)

  async function fetchBoards(reset = true) {
    if (reset) {
      boards.value = []
      page.value   = 1
    }
    loading.value = true
    try {
      const result  = await boardService.getAll({ page: page.value, limit: PAGE_SIZE })
      const newData = result.data ?? []
      boards.value  = reset ? newData : [...boards.value, ...newData]
      total.value   = result.total ?? newData.length
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des boards')
    } finally {
      loading.value = false
    }
  }

  async function loadMore() {
    if (!hasMore.value || loading.value) return
    page.value++
    await fetchBoards(false)
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
      boards.value.unshift(result.data)
      total.value++
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
      total.value = Math.max(0, total.value - 1)
      useNotificationStore().success('Board supprimé')
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la suppression')
      return false
    }
  }

  return {
    boards, currentBoard, loading, total, hasMore,
    fetchBoards, loadMore, fetchBoard, createBoard, updateBoard, removeBoard,
  }
})
