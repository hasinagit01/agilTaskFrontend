import { defineStore } from 'pinia'
import { ref } from 'vue'
import { activityService } from '@/services/activity.service'
import { useNotificationStore } from './notification.store'

export const useActivityStore = defineStore('activity', () => {
  const activities = ref([])
  const loading    = ref(false)

  async function fetchActivities(boardId) {
    loading.value = true
    try {
      const result = await activityService.getBoardActivity(boardId)
      activities.value = result.data || []
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors du chargement de l\'activité')
    } finally {
      loading.value = false
    }
  }

  function reset() {
    activities.value = []
  }

  return { activities, loading, fetchActivities, reset }
})
