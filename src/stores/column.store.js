import { defineStore } from 'pinia'
import { ref } from 'vue'
import { columnService } from '@/services/column.service'
import { useNotificationStore } from './notification.store'

export const useColumnStore = defineStore('column', () => {
  const columns = ref([])
  const loading = ref(false)

  async function fetchColumns(boardId) {
    loading.value = true
    try {
      const result = await columnService.getAll(boardId)
      columns.value = result.data.sort((a, b) => a.position - b.position)
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des colonnes')
    } finally {
      loading.value = false
    }
  }

  async function createColumn(boardId, name) {
    try {
      const result = await columnService.create(boardId, { name })
      columns.value.push(result.data)
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la création de la colonne')
      return null
    }
  }

  async function updateColumn(boardId, columnId, data) {
    try {
      const result = await columnService.update(boardId, columnId, data)
      const idx = columns.value.findIndex(c => c.id === columnId)
      if (idx !== -1) columns.value[idx] = result.data
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la mise à jour')
      return null
    }
  }

  async function removeColumn(boardId, columnId) {
    try {
      await columnService.remove(boardId, columnId)
      columns.value = columns.value.filter(c => c.id !== columnId)
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la suppression')
      return false
    }
  }

  function reset() {
    columns.value = []
  }

  return {
    columns, loading,
    fetchColumns, createColumn, updateColumn, removeColumn, reset,
  }
})
