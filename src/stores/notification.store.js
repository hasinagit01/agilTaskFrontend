import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  let nextId = 0

  function add({ message, color = 'info', timeout = 4000, icon = null }) {
    const id = nextId++
    notifications.value.push({ id, message, color, timeout, icon, visible: true })
    setTimeout(() => remove(id), timeout + 300)
    return id
  }

  function remove(id) {
    const idx = notifications.value.findIndex(n => n.id === id)
    if (idx !== -1) notifications.value.splice(idx, 1)
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

  return { notifications, add, remove, success, error, warning, info }
})
