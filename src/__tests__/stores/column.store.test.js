import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useColumnStore } from '@/stores/column.store'

vi.mock('@/services/column.service', () => ({
  columnService: {
    getAll:   vi.fn(),
    create:   vi.fn(),
    update:   vi.fn(),
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

import { columnService } from '@/services/column.service'

const MOCK_COLUMNS = [
  { id: 1, name: 'Todo',  position: 0, board_id: 1 },
  { id: 2, name: 'Doing', position: 1, board_id: 1 },
  { id: 3, name: 'Done',  position: 2, board_id: 1 },
]

describe('column.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== fetchColumns() =====
  describe('fetchColumns()', () => {
    it('charge et trie les colonnes par position', async () => {
      const shuffled = [MOCK_COLUMNS[2], MOCK_COLUMNS[0], MOCK_COLUMNS[1]]
      columnService.getAll.mockResolvedValue({ data: shuffled })

      const store = useColumnStore()
      await store.fetchColumns(1)

      expect(store.columns[0].position).toBe(0)
      expect(store.columns[1].position).toBe(1)
      expect(store.columns[2].position).toBe(2)
      expect(store.loading).toBe(false)
    })

    it('garde la liste vide en cas d\'erreur', async () => {
      columnService.getAll.mockRejectedValue({ message: 'Erreur' })

      const store = useColumnStore()
      await store.fetchColumns(1)

      expect(store.columns).toEqual([])
    })
  })

  // ===== createColumn() =====
  describe('createColumn()', () => {
    it('ajoute la colonne à la liste', async () => {
      const newCol = { id: 4, name: 'Review', position: 3, board_id: 1 }
      columnService.create.mockResolvedValue({ data: newCol })

      const store = useColumnStore()
      const result = await store.createColumn(1, 'Review')

      expect(result).toEqual(newCol)
      expect(store.columns).toContainEqual(newCol)
    })

    it('retourne null en cas d\'erreur', async () => {
      columnService.create.mockRejectedValue({ message: 'Erreur' })

      const store = useColumnStore()
      const result = await store.createColumn(1, 'Fail')

      expect(result).toBeNull()
    })
  })

  // ===== updateColumn() =====
  describe('updateColumn()', () => {
    it('met à jour la colonne dans la liste', async () => {
      columnService.getAll.mockResolvedValue({ data: MOCK_COLUMNS })
      columnService.update.mockResolvedValue({ data: { id: 1, name: 'Renamed', position: 0, board_id: 1 } })

      const store = useColumnStore()
      await store.fetchColumns(1)
      await store.updateColumn(1, 1, { name: 'Renamed' })

      expect(store.columns.find(c => c.id === 1).name).toBe('Renamed')
    })

    it('retourne null en cas d\'erreur', async () => {
      columnService.update.mockRejectedValue({ message: 'Erreur' })

      const store = useColumnStore()
      const result = await store.updateColumn(1, 99, { name: 'Fail' })

      expect(result).toBeNull()
    })
  })

  // ===== removeColumn() =====
  describe('removeColumn()', () => {
    it('retire la colonne de la liste', async () => {
      columnService.getAll.mockResolvedValue({ data: MOCK_COLUMNS })
      columnService.remove.mockResolvedValue({})

      const store = useColumnStore()
      await store.fetchColumns(1)
      await store.removeColumn(1, 1)

      expect(store.columns.find(c => c.id === 1)).toBeUndefined()
      expect(store.columns).toHaveLength(2)
    })

    it('retourne false en cas d\'erreur', async () => {
      columnService.remove.mockRejectedValue({ message: 'Erreur' })

      const store = useColumnStore()
      const result = await store.removeColumn(1, 99)

      expect(result).toBe(false)
    })
  })

  // ===== reorderColumns() =====
  describe('reorderColumns()', () => {
    it('applique le nouvel ordre en optimiste', async () => {
      columnService.getAll.mockResolvedValue({ data: MOCK_COLUMNS })
      columnService.reorder.mockResolvedValue({})

      const store = useColumnStore()
      await store.fetchColumns(1)
      await store.reorderColumns(1, [3, 1, 2])

      expect(store.columns[0].id).toBe(3)
      expect(store.columns[1].id).toBe(1)
      expect(store.columns[2].id).toBe(2)
    })

    it('revient à l\'état précédent en cas d\'erreur', async () => {
      columnService.getAll.mockResolvedValue({ data: MOCK_COLUMNS })
      columnService.reorder.mockRejectedValue({ message: 'Erreur' })

      const store = useColumnStore()
      await store.fetchColumns(1)
      await store.reorderColumns(1, [3, 1, 2])

      expect(store.columns[0].id).toBe(1)
    })
  })

  // ===== reset() =====
  describe('reset()', () => {
    it('vide la liste des colonnes', async () => {
      columnService.getAll.mockResolvedValue({ data: MOCK_COLUMNS })

      const store = useColumnStore()
      await store.fetchColumns(1)
      store.reset()

      expect(store.columns).toEqual([])
    })
  })
})
