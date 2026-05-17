import { defineStore } from 'pinia'
import { ref } from 'vue'
import { memberService } from '@/services/member.service'
import { useNotificationStore } from './notification.store'

export const useMemberStore = defineStore('member', () => {
  const members = ref([])
  const loading = ref(false)

  async function fetchMembers(boardId) {
    loading.value = true
    try {
      const result = await memberService.getAll(boardId)
      members.value = result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des membres')
    } finally {
      loading.value = false
    }
  }

  async function addMember(boardId, data) {
    try {
      await memberService.add(boardId, data)
      await fetchMembers(boardId)
      useNotificationStore().success('Membre ajouté')
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de l\'ajout du membre')
      return null
    }
  }

  async function updateMemberRole(boardId, userId, role) {
    try {
      const result = await memberService.updateRole(boardId, userId, { role })
      const idx = members.value.findIndex(m => m.user_id === userId)
      if (idx !== -1) members.value[idx] = result.data
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la mise à jour du rôle')
      return null
    }
  }

  async function removeMember(boardId, userId) {
    try {
      await memberService.remove(boardId, userId)
      members.value = members.value.filter(m => m.user_id !== userId)
      useNotificationStore().success('Membre retiré')
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du retrait du membre')
      return false
    }
  }

  function reset() {
    members.value = []
  }

  return {
    members, loading,
    fetchMembers, addMember, updateMemberRole, removeMember, reset,
  }
})
