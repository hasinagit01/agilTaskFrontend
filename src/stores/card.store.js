import { defineStore } from 'pinia'
import { ref } from 'vue'
import { cardService } from '@/services/card.service'
import { useNotificationStore } from './notification.store'

export const useCardStore = defineStore('card', () => {
  // cards indexed by column_id: { [columnId]: Card[] }
  const cardsByColumn = ref({})
  const loading = ref(false)

  async function fetchCards(boardId, columnId) {
    loading.value = true
    try {
      const result = await cardService.getAll(boardId, columnId)
      cardsByColumn.value[columnId] = result.data.sort((a, b) => a.position - b.position)
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du chargement des cartes')
    } finally {
      loading.value = false
    }
  }

  async function createCard(boardId, columnId, data) {
    try {
      const result = await cardService.create(boardId, columnId, data)
      if (!cardsByColumn.value[columnId]) cardsByColumn.value[columnId] = []
      cardsByColumn.value[columnId].push(result.data)
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la création de la carte')
      return null
    }
  }

  async function updateCard(boardId, columnId, cardId, data) {
    try {
      const result = await cardService.update(boardId, columnId, cardId, data)
      const cards = cardsByColumn.value[columnId] || []
      const idx = cards.findIndex(c => c.id === cardId)
      if (idx !== -1) cards[idx] = result.data
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la mise à jour')
      return null
    }
  }

  async function moveCard(boardId, fromColumnId, cardId, targetColumnId) {
    try {
      const result = await cardService.move(boardId, fromColumnId, cardId, targetColumnId)
      // Retirer de la colonne source
      if (cardsByColumn.value[fromColumnId]) {
        cardsByColumn.value[fromColumnId] = cardsByColumn.value[fromColumnId].filter(c => c.id !== cardId)
      }
      // Ajouter dans la colonne cible
      if (!cardsByColumn.value[targetColumnId]) cardsByColumn.value[targetColumnId] = []
      cardsByColumn.value[targetColumnId].push(result.data)
      cardsByColumn.value[targetColumnId].sort((a, b) => a.position - b.position)
      return result.data
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors du déplacement')
      return null
    }
  }

  async function removeCard(boardId, columnId, cardId) {
    try {
      await cardService.remove(boardId, columnId, cardId)
      if (cardsByColumn.value[columnId]) {
        cardsByColumn.value[columnId] = cardsByColumn.value[columnId].filter(c => c.id !== cardId)
      }
      return true
    } catch (error) {
      useNotificationStore().error(error.message || 'Erreur lors de la suppression')
      return false
    }
  }

  async function reorderCards(boardId, columnId, cardIds) {
    const previous = [...(cardsByColumn.value[columnId] || [])]
    cardsByColumn.value[columnId] = cardIds
      .map((id, i) => ({ ...(cardsByColumn.value[columnId] || []).find(c => c.id === id), position: i + 1 }))
      .filter(Boolean)
    try {
      await cardService.reorder(boardId, columnId, cardIds)
    } catch (error) {
      cardsByColumn.value[columnId] = previous
      useNotificationStore().error('Erreur lors du réordonnancement des cartes')
    }
  }

  function reset() {
    cardsByColumn.value = {}
  }

  function wsHandleCardCreated(card) {
    const col = cardsByColumn.value[card.column_id]
    if (!col) return
    if (!col.find(c => c.id === card.id)) {
      col.push(card)
      col.sort((a, b) => a.position - b.position)
    }
  }

  function wsHandleCardUpdated(card) {
    const col = cardsByColumn.value[card.column_id]
    if (!col) return
    const idx = col.findIndex(c => c.id === card.id)
    if (idx !== -1) col[idx] = card
  }

  function wsHandleCardMoved(card) {
    const fromId = card.from_column_id
    if (cardsByColumn.value[fromId]) {
      cardsByColumn.value[fromId] = cardsByColumn.value[fromId].filter(c => c.id !== card.id)
    }
    const toCol = cardsByColumn.value[card.column_id]
    if (toCol && !toCol.find(c => c.id === card.id)) {
      toCol.push(card)
      toCol.sort((a, b) => a.position - b.position)
    }
  }

  function wsHandleCardDeleted({ card_id, column_id }) {
    if (cardsByColumn.value[column_id]) {
      cardsByColumn.value[column_id] = cardsByColumn.value[column_id].filter(c => c.id !== card_id)
    }
  }

  function wsHandleCardsReordered({ column_id, cards }) {
    cardsByColumn.value[column_id] = cards
  }

  return {
    cardsByColumn, loading,
    fetchCards, createCard, updateCard, moveCard, removeCard, reorderCards, reset,
    wsHandleCardCreated, wsHandleCardUpdated, wsHandleCardMoved, wsHandleCardDeleted, wsHandleCardsReordered,
  }
})
