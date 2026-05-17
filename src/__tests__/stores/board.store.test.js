import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBoardStore } from '@/stores/board.store'

vi.mock('@/services/board.service', () => ({
  boardService: {
    getAll:  vi.fn(),
    getById: vi.fn(),
    create:  vi.fn(),
    update:  vi.fn(),
    remove:  vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({
    success: vi.fn(),
    error:   vi.fn(),
  }),
}))

import { boardService } from '@/services/board.service'

const MOCK_BOARDS = [
  { id: 1, name: 'Board A' },
  { id: 2, name: 'Board B' },
]

describe('board.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== fetchBoards() =====
  describe('fetchBoards()', () => {
    it('charge et stocke les boards', async () => {
      boardService.getAll.mockResolvedValue({ data: MOCK_BOARDS })

      const store = useBoardStore()
      await store.fetchBoards()

      expect(store.boards).toEqual(MOCK_BOARDS)
      expect(store.loading).toBe(false)
    })

    it('garde la liste vide en cas d\'erreur', async () => {
      boardService.getAll.mockRejectedValue({ message: 'Erreur réseau' })

      const store = useBoardStore()
      await store.fetchBoards()

      expect(store.boards).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  // ===== fetchBoard() =====
  describe('fetchBoard()', () => {
    it('stocke le board courant', async () => {
      boardService.getById.mockResolvedValue({ data: MOCK_BOARDS[0] })

      const store = useBoardStore()
      const board = await store.fetchBoard(1)

      expect(board).toEqual(MOCK_BOARDS[0])
      expect(store.currentBoard).toEqual(MOCK_BOARDS[0])
    })

    it('retourne null en cas d\'erreur', async () => {
      boardService.getById.mockRejectedValue({ message: 'Board introuvable' })

      const store = useBoardStore()
      const board = await store.fetchBoard(99)

      expect(board).toBeNull()
      expect(store.currentBoard).toBeNull()
    })
  })

  // ===== createBoard() =====
  describe('createBoard()', () => {
    it('ajoute le board à la liste et le retourne', async () => {
      const newBoard = { id: 3, name: 'Nouveau' }
      boardService.create.mockResolvedValue({ data: newBoard })

      const store  = useBoardStore()
      const result = await store.createBoard('Nouveau')

      expect(result).toEqual(newBoard)
      expect(store.boards).toContainEqual(newBoard)
    })

    it('retourne null en cas d\'erreur', async () => {
      boardService.create.mockRejectedValue({ message: 'Erreur' })

      const store  = useBoardStore()
      const result = await store.createBoard('Echec')

      expect(result).toBeNull()
      expect(store.boards).toHaveLength(0)
    })
  })

  // ===== updateBoard() =====
  describe('updateBoard()', () => {
    it('met à jour le board dans la liste', async () => {
      boardService.getAll.mockResolvedValue({ data: MOCK_BOARDS })
      boardService.update.mockResolvedValue({ data: { id: 1, name: 'Board A renommé' } })

      const store = useBoardStore()
      await store.fetchBoards()
      await store.updateBoard(1, 'Board A renommé')

      const updated = store.boards.find(b => b.id === 1)
      expect(updated.name).toBe('Board A renommé')
    })

    it('met à jour currentBoard si c\'est le board modifié', async () => {
      boardService.getById.mockResolvedValue({ data: MOCK_BOARDS[0] })
      boardService.update.mockResolvedValue({ data: { id: 1, name: 'Modifié' } })

      const store = useBoardStore()
      await store.fetchBoard(1)
      await store.updateBoard(1, 'Modifié')

      expect(store.currentBoard.name).toBe('Modifié')
    })
  })

  // ===== removeBoard() =====
  describe('removeBoard()', () => {
    it('retire le board de la liste', async () => {
      boardService.getAll.mockResolvedValue({ data: MOCK_BOARDS })
      boardService.remove.mockResolvedValue({})

      const store = useBoardStore()
      await store.fetchBoards()
      await store.removeBoard(1)

      expect(store.boards).toHaveLength(1)
      expect(store.boards[0].id).toBe(2)
    })

    it('efface currentBoard si c\'est le board supprimé', async () => {
      boardService.getById.mockResolvedValue({ data: MOCK_BOARDS[0] })
      boardService.remove.mockResolvedValue({})

      const store = useBoardStore()
      await store.fetchBoard(1)
      await store.removeBoard(1)

      expect(store.currentBoard).toBeNull()
    })
  })
})
