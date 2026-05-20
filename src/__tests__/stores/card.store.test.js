import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useCardStore } from '@/stores/card.store'

vi.mock('@/services/card.service', () => ({
  cardService: {
    getAll:   vi.fn(),
    create:   vi.fn(),
    update:   vi.fn(),
    move:     vi.fn(),
    remove:   vi.fn(),
    reorder:  vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({
    success: vi.fn(),
    error:   vi.fn(),
  }),
}))

import { cardService } from '@/services/card.service'

const CARDS_COL_1 = [
  { id: 1, title: 'Card A', position: 0, column_id: 1 },
  { id: 2, title: 'Card B', position: 1, column_id: 1 },
]
const CARDS_COL_2 = [
  { id: 3, title: 'Card C', position: 0, column_id: 2 },
]

describe('card.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== fetchCards() =====
  describe('fetchCards()', () => {
    it('charge et trie les cartes par position', async () => {
      const shuffled = [CARDS_COL_1[1], CARDS_COL_1[0]]
      cardService.getAll.mockResolvedValue({ data: shuffled })

      const store = useCardStore()
      await store.fetchCards(1, 1)

      expect(store.cardsByColumn[1][0].position).toBe(0)
      expect(store.cardsByColumn[1][1].position).toBe(1)
    })

    it('indexe les cartes par colonne', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })

      const store = useCardStore()
      await store.fetchCards(1, 1)

      expect(store.cardsByColumn[1]).toHaveLength(2)
    })
  })

  // ===== createCard() =====
  describe('createCard()', () => {
    it('ajoute la carte dans la bonne colonne', async () => {
      const newCard = { id: 4, title: 'Card D', position: 0, column_id: 1 }
      cardService.create.mockResolvedValue({ data: newCard })

      const store = useCardStore()
      const result = await store.createCard(1, 1, { title: 'Card D' })

      expect(result).toEqual(newCard)
      expect(store.cardsByColumn[1]).toContainEqual(newCard)
    })

    it('retourne null en cas d\'erreur', async () => {
      cardService.create.mockRejectedValue({ message: 'Erreur' })

      const store = useCardStore()
      const result = await store.createCard(1, 1, { title: 'Fail' })

      expect(result).toBeNull()
    })
  })

  // ===== updateCard() =====
  describe('updateCard()', () => {
    it('met à jour la carte dans sa colonne', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })
      cardService.update.mockResolvedValue({ data: { id: 1, title: 'Updated', position: 0, column_id: 1 } })

      const store = useCardStore()
      await store.fetchCards(1, 1)
      await store.updateCard(1, 1, 1, { title: 'Updated' })

      expect(store.cardsByColumn[1].find(c => c.id === 1).title).toBe('Updated')
    })

    it('retourne null en cas d\'erreur', async () => {
      cardService.update.mockRejectedValue({ message: 'Erreur' })

      const store = useCardStore()
      const result = await store.updateCard(1, 1, 99, { title: 'Fail' })

      expect(result).toBeNull()
    })
  })

  // ===== moveCard() =====
  describe('moveCard()', () => {
    it('retire la carte de la colonne source et l\'ajoute dans la cible', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })
      const movedCard = { id: 1, title: 'Card A', position: 0, column_id: 2 }
      cardService.move.mockResolvedValue({ data: movedCard })

      const store = useCardStore()
      await store.fetchCards(1, 1)
      await store.moveCard(1, 1, 1, 2)

      expect(store.cardsByColumn[1].find(c => c.id === 1)).toBeUndefined()
      expect(store.cardsByColumn[2]).toContainEqual(movedCard)
    })

    it('retourne null en cas d\'erreur', async () => {
      cardService.move.mockRejectedValue({ message: 'Erreur' })

      const store = useCardStore()
      const result = await store.moveCard(1, 1, 1, 2)

      expect(result).toBeNull()
    })
  })

  // ===== removeCard() =====
  describe('removeCard()', () => {
    it('retire la carte de sa colonne', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })
      cardService.remove.mockResolvedValue({})

      const store = useCardStore()
      await store.fetchCards(1, 1)
      await store.removeCard(1, 1, 1)

      expect(store.cardsByColumn[1].find(c => c.id === 1)).toBeUndefined()
      expect(store.cardsByColumn[1]).toHaveLength(1)
    })

    it('retourne false en cas d\'erreur', async () => {
      cardService.remove.mockRejectedValue({ message: 'Erreur' })

      const store = useCardStore()
      const result = await store.removeCard(1, 1, 99)

      expect(result).toBe(false)
    })
  })

  // ===== reorderCards() =====
  describe('reorderCards()', () => {
    it('applique le nouvel ordre en optimiste', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })
      cardService.reorder.mockResolvedValue({})

      const store = useCardStore()
      await store.fetchCards(1, 1)
      await store.reorderCards(1, 1, [2, 1])

      expect(store.cardsByColumn[1][0].id).toBe(2)
      expect(store.cardsByColumn[1][1].id).toBe(1)
    })

    it('revient à l\'état précédent en cas d\'erreur', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })
      cardService.reorder.mockRejectedValue({ message: 'Erreur' })

      const store = useCardStore()
      await store.fetchCards(1, 1)
      await store.reorderCards(1, 1, [2, 1])

      expect(store.cardsByColumn[1][0].id).toBe(1)
    })
  })

  // ===== reset() =====
  describe('reset()', () => {
    it('vide toutes les cartes', async () => {
      cardService.getAll.mockResolvedValue({ data: CARDS_COL_1 })

      const store = useCardStore()
      await store.fetchCards(1, 1)
      store.reset()

      expect(store.cardsByColumn).toEqual({})
    })
  })
})
