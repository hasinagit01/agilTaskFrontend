import { defineStore } from 'pinia'
import { ref } from 'vue'
import { labelService } from '@/services/label.service'
import { useNotificationStore } from './notification.store'

export const useLabelStore = defineStore('label', () => {
  const labels = ref([])
  const loading = ref(false)

  async function fetchLabels(boardId) {
    loading.value = true
    try {
      const result = await labelService.getAll(boardId)
      labels.value = result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des labels')
    } finally {
      loading.value = false
    }
  }

  async function createLabel(boardId, data) {
    try {
      const result = await labelService.create(boardId, data)
      labels.value.push(result.data)
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la création du label')
      return null
    }
  }

  async function updateLabel(boardId, labelId, data) {
    try {
      const result = await labelService.update(boardId, labelId, data)
      const idx = labels.value.findIndex(l => l.id === labelId)
      if (idx !== -1) labels.value[idx] = result.data
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la mise à jour')
      return null
    }
  }

  async function removeLabel(boardId, labelId) {
    try {
      await labelService.remove(boardId, labelId)
      labels.value = labels.value.filter(l => l.id !== labelId)
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la suppression')
      return false
    }
  }

  function reset() {
    labels.value = []
  }

  return {
    labels, loading,
    fetchLabels, createLabel, updateLabel, removeLabel, reset,
  }
})
