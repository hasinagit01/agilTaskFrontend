import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const HISTORY_MAX = 20

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const history       = ref([])
  const unreadCount   = ref(0)
  let nextId = 0

  function add({ message, color = 'info', timeout = 4000, icon = null }) {
    const id = nextId++
    notifications.value.push({ id, message, color, timeout, icon, visible: true })
    setTimeout(() => remove(id), timeout + 300)

    history.value.unshift({ id, message, color, icon, created_at: new Date().toISOString() })
    if (history.value.length > HISTORY_MAX) history.value.pop()
    unreadCount.value++

    return id
  }

  function remove(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) notifications.value.splice(idx, 1)
  }

  function markAllRead() {
    unreadCount.value = 0
  }

  function clearHistory() {
    history.value     = []
    unreadCount.value = 0
  }

  function success(message) {
    return add({ message, color: 'success', icon: 'mdi-check-circle' })
  }

  function error(message) {
    return add({ message, color: 'error', icon: 'mdi-alert-circle', timeout: 6000 })
  }

  function warning(message) {
    return add({ message, color: 'warning', icon: 'mdi-alert', timeout: 5000 })
  }

  function info(message) {
    return add({ message, color: 'info', icon: 'mdi-information' })
  }

  const hasUnread = computed(() => unreadCount.value > 0)

  return { notifications, history, unreadCount, hasUnread, add, remove, markAllRead, clearHistory, success, error, warning, info }
})
