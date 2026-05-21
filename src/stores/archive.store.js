import { defineStore } from 'pinia'
import { ref } from 'vue'
import { archiveService } from '@/services/archive.service'
import { cardService }    from '@/services/card.service'
import { columnService }  from '@/services/column.service'
import { useNotificationStore } from './notification.store'
import { useCardStore } from './card.store'
import { useColumnStore } from './column.store'

export const useArchiveStore = defineStore('archive', () => {
  const archivedCards   = ref([])
  const archivedColumns = ref([])
  const loading         = ref(false)

  async function fetchArchives(boardId) {
    loading.value = true
    try {
      const [cards, columns] = await Promise.all([
        archiveService.getArchivedCards(boardId),
        archiveService.getArchivedColumns(boardId),
      ])
      archivedCards.value   = cards.data   || []
      archivedColumns.value = columns.data || []
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors du chargement des archives')
    } finally {
      loading.value = false
    }
  }

  async function archiveCard(boardId, columnId, cardId) {
    try {
      await archiveService.archiveCard(boardId, columnId, cardId)
      const cardStore = useCardStore()
      if (cardStore.cardsByColumn[columnId]) {
        const card = cardStore.cardsByColumn[columnId].find(c => c.id === cardId)
        if (card) archivedCards.value.unshift({ ...card, column_id: columnId })
        cardStore.cardsByColumn[columnId] = cardStore.cardsByColumn[columnId].filter(c => c.id !== cardId)
      }
      useNotificationStore().success('Carte archivée.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de l\'archivage')
    }
  }

  async function restoreCard(boardId, cardId) {
    try {
      const result = await archiveService.unarchiveCard(boardId, cardId)
      archivedCards.value = archivedCards.value.filter(c => c.id !== cardId)
      const cardStore = useCardStore()
      const card = result.data
      if (!cardStore.cardsByColumn[card.column_id]) cardStore.cardsByColumn[card.column_id] = []
      cardStore.cardsByColumn[card.column_id].push(card)
      cardStore.cardsByColumn[card.column_id].sort((a, b) => a.position - b.position)
      useNotificationStore().success('Carte restaurée.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de la restauration')
    }
  }

  async function archiveColumn(boardId, columnId) {
    try {
      await archiveService.archiveColumn(boardId, columnId)
      const columnStore = useColumnStore()
      const column = columnStore.columns.find(c => c.id === columnId)
      if (column) archivedColumns.value.unshift({ ...column })
      columnStore.columns = columnStore.columns.filter(c => c.id !== columnId)
      useNotificationStore().success('Colonne archivée.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de l\'archivage')
    }
  }

  async function restoreColumn(boardId, columnId) {
    try {
      const result = await archiveService.unarchiveColumn(boardId, columnId)
      archivedColumns.value = archivedColumns.value.filter(c => c.id !== columnId)
      const columnStore = useColumnStore()
      columnStore.columns.push(result.data)
      columnStore.columns.sort((a, b) => a.position - b.position)
      useNotificationStore().success('Colonne restaurée.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de la restauration')
    }
  }

  async function deleteArchivedCard(boardId, card) {
    try {
      await cardService.remove(boardId, card.column_id, card.id)
      archivedCards.value = archivedCards.value.filter(c => c.id !== card.id)
      useNotificationStore().success('Carte supprimée définitivement.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de la suppression')
    }
  }

  async function deleteArchivedColumn(boardId, columnId) {
    try {
      await columnService.remove(boardId, columnId)
      archivedColumns.value = archivedColumns.value.filter(c => c.id !== columnId)
      useNotificationStore().success('Colonne supprimée définitivement.')
    } catch (err) {
      useNotificationStore().error(err.message || 'Erreur lors de la suppression')
    }
  }

  function reset() {
    archivedCards.value   = []
    archivedColumns.value = []
  }

  return {
    archivedCards, archivedColumns, loading,
    fetchArchives, archiveCard, restoreCard, archiveColumn, restoreColumn,
    deleteArchivedCard, deleteArchivedColumn, reset,
  }
})
