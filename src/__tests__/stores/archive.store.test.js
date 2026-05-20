import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useArchiveStore } from '@/stores/archive.store'

vi.mock('@/services/archive.service', () => ({
  archiveService: {
    getArchivedCards:   vi.fn(),
    getArchivedColumns: vi.fn(),
    archiveCard:        vi.fn(),
    unarchiveCard:      vi.fn(),
    archiveColumn:      vi.fn(),
    unarchiveColumn:    vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({ success: vi.fn(), error: vi.fn() }),
}))

vi.mock('@/stores/card.store', () => ({
  useCardStore: () => ({
    cardsByColumn: { 1: [{ id: 10, title: 'Card A', position: 0, column_id: 1 }] },
  }),
}))

vi.mock('@/stores/column.store', () => ({
  useColumnStore: () => ({
    columns: [{ id: 1, name: 'Todo', position: 0 }],
  }),
}))

import { archiveService } from '@/services/archive.service'

describe('archive.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchArchives()', () => {
    it('charge les cartes et colonnes archivées', async () => {
      archiveService.getArchivedCards.mockResolvedValue({ data: [{ id: 10, title: 'Card A' }] })
      archiveService.getArchivedColumns.mockResolvedValue({ data: [{ id: 1, name: 'Col A' }] })

      const store = useArchiveStore()
      await store.fetchArchives(1)

      expect(store.archivedCards).toHaveLength(1)
      expect(store.archivedColumns).toHaveLength(1)
    })

    it('gère les erreurs gracieusement', async () => {
      archiveService.getArchivedCards.mockRejectedValue({ message: 'Erreur' })
      archiveService.getArchivedColumns.mockRejectedValue({ message: 'Erreur' })

      const store = useArchiveStore()
      await store.fetchArchives(1)

      expect(store.archivedCards).toEqual([])
      expect(store.archivedColumns).toEqual([])
    })
  })

  describe('archiveCard()', () => {
    it('retire la carte du cardStore et l\'ajoute aux archives', async () => {
      archiveService.archiveCard.mockResolvedValue({})

      const store = useArchiveStore()
      await store.archiveCard(1, 1, 10)

      expect(archiveService.archiveCard).toHaveBeenCalledWith(1, 1, 10)
    })
  })

  describe('restoreCard()', () => {
    it('retire la carte des archives', async () => {
      archiveService.unarchiveCard.mockResolvedValue({ data: { id: 10, title: 'Card A', column_id: 1, position: 0 } })

      const store = useArchiveStore()
      store.archivedCards = [{ id: 10, title: 'Card A' }]
      await store.restoreCard(1, 10)

      expect(store.archivedCards).toHaveLength(0)
    })
  })

  describe('archiveColumn()', () => {
    it('retire la colonne du columnStore', async () => {
      archiveService.archiveColumn.mockResolvedValue({})

      const store = useArchiveStore()
      await store.archiveColumn(1, 1)

      expect(archiveService.archiveColumn).toHaveBeenCalledWith(1, 1)
    })
  })

  describe('restoreColumn()', () => {
    it('retire la colonne des archives', async () => {
      archiveService.unarchiveColumn.mockResolvedValue({ data: { id: 1, name: 'Todo', position: 0 } })

      const store = useArchiveStore()
      store.archivedColumns = [{ id: 1, name: 'Todo' }]
      await store.restoreColumn(1, 1)

      expect(store.archivedColumns).toHaveLength(0)
    })
  })

  describe('reset()', () => {
    it('vide les archives', async () => {
      archiveService.getArchivedCards.mockResolvedValue({ data: [{ id: 1 }] })
      archiveService.getArchivedColumns.mockResolvedValue({ data: [{ id: 2 }] })

      const store = useArchiveStore()
      await store.fetchArchives(1)
      store.reset()

      expect(store.archivedCards).toEqual([])
      expect(store.archivedColumns).toEqual([])
    })
  })
})
