import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// ── vi.hoisted() : variables accessibles dans les factories vi.mock ────────────

const {
  mockWsConnect, mockWsDisconnect, mockWsOnMessage, mockWsOnStatusChange,
  getCapturedCallback, getCapturedStatusCallback,
} = vi.hoisted(() => {
  let _msgCb    = null
  let _statusCb = null
  return {
    mockWsConnect:    vi.fn(),
    mockWsDisconnect: vi.fn(),
    mockWsOnMessage:  vi.fn(cb => { _msgCb = cb;    return vi.fn() }),
    mockWsOnStatusChange: vi.fn(cb => { _statusCb = cb; return vi.fn() }),
    getCapturedCallback:       () => _msgCb,
    getCapturedStatusCallback: () => _statusCb,
  }
})

const {
  mockCardCreated, mockCardUpdated, mockCardMoved,
  mockCardDeleted, mockCardsReordered, mockFetchCards,
} = vi.hoisted(() => ({
  mockCardCreated:    vi.fn(),
  mockCardUpdated:    vi.fn(),
  mockCardMoved:      vi.fn(),
  mockCardDeleted:    vi.fn(),
  mockCardsReordered: vi.fn(),
  mockFetchCards:     vi.fn().mockResolvedValue(undefined),
}))

const {
  mockColCreated, mockColUpdated, mockColDeleted, mockColsReordered, mockFetchColumns,
} = vi.hoisted(() => ({
  mockColCreated:    vi.fn(),
  mockColUpdated:    vi.fn(),
  mockColDeleted:    vi.fn(),
  mockColsReordered: vi.fn(),
  mockFetchColumns:  vi.fn().mockResolvedValue(undefined),
}))

const { mockBoardRenamed, mockFetchBoard } = vi.hoisted(() => ({
  mockBoardRenamed: vi.fn(),
  mockFetchBoard:   vi.fn().mockResolvedValue(undefined),
}))

const { mockNotifInfo } = vi.hoisted(() => ({ mockNotifInfo: vi.fn() }))

// ── Mocks des modules ─────────────────────────────────────────────────────────

vi.mock('@/services/websocket.service', () => ({
  wsService: {
    connect:        mockWsConnect,
    disconnect:     mockWsDisconnect,
    onMessage:      mockWsOnMessage,
    onStatusChange: mockWsOnStatusChange,
  },
}))

vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    token:       'mock-jwt',
    currentUser: { id: 1, email: 'a@b.com' },
  }),
}))

vi.mock('@/stores/card.store', () => ({
  useCardStore: () => ({
    cardsByColumn:          { 1: [{ id: 1 }] },
    wsHandleCardCreated:    mockCardCreated,
    wsHandleCardUpdated:    mockCardUpdated,
    wsHandleCardMoved:      mockCardMoved,
    wsHandleCardDeleted:    mockCardDeleted,
    wsHandleCardsReordered: mockCardsReordered,
    fetchCards:             mockFetchCards,
  }),
}))

vi.mock('@/stores/column.store', () => ({
  useColumnStore: () => ({
    wsHandleColumnCreated:    mockColCreated,
    wsHandleColumnUpdated:    mockColUpdated,
    wsHandleColumnDeleted:    mockColDeleted,
    wsHandleColumnsReordered: mockColsReordered,
    fetchColumns:             mockFetchColumns,
  }),
}))

vi.mock('@/stores/board.store', () => ({
  useBoardStore: () => ({
    wsHandleBoardRenamed: mockBoardRenamed,
    fetchBoard:           mockFetchBoard,
  }),
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({
    info:    mockNotifInfo,
    success: vi.fn(),
    error:   vi.fn(),
  }),
}))

import { useRealtimeStore } from '@/stores/realtime.store'

// ── Helpers ────────────────────────────────────────────────────────────────────

function emit(type, data, actor_id = 999) {
  getCapturedCallback()?.({ type, actor_id, data })
}

function emitStatus(connected, isReconnect = false) {
  getCapturedStatusCallback()?.({ connected, isReconnect })
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('realtime.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ── connect / disconnect ───────────────────────────────────────────────────

  describe('connect()', () => {
    it('appelle wsService.connect avec boardId et token', () => {
      useRealtimeStore().connect(7)
      expect(mockWsConnect).toHaveBeenCalledWith(7, 'mock-jwt')
    })

    it('s\'abonne aux messages', () => {
      useRealtimeStore().connect(1)
      expect(mockWsOnMessage).toHaveBeenCalled()
    })

    it('s\'abonne aux changements de statut', () => {
      useRealtimeStore().connect(1)
      expect(mockWsOnStatusChange).toHaveBeenCalled()
    })
  })

  describe('disconnect()', () => {
    it('appelle wsService.disconnect', () => {
      const store = useRealtimeStore()
      store.connect(1)
      store.disconnect()
      expect(mockWsDisconnect).toHaveBeenCalled()
    })

    it('passe connected à false', () => {
      const store = useRealtimeStore()
      store.connect(1)
      emitStatus(true)
      store.disconnect()
      expect(store.connected).toBe(false)
    })
  })

  // ── Statut de connexion réactif ────────────────────────────────────────────

  describe('connected (réactif via onStatusChange)', () => {
    it('passe à true quand wsService signale une connexion', () => {
      const store = useRealtimeStore()
      store.connect(1)
      emitStatus(true)
      expect(store.connected).toBe(true)
    })

    it('passe à false quand wsService signale une déconnexion', () => {
      const store = useRealtimeStore()
      store.connect(1)
      emitStatus(true)
      emitStatus(false)
      expect(store.connected).toBe(false)
    })
  })

  // ── Reconnexion ────────────────────────────────────────────────────────────

  describe('reconnexion', () => {
    it('notifie l\'utilisateur et re-fetch les données', async () => {
      const store = useRealtimeStore()
      store.connect(5)
      emitStatus(true, true) // isReconnect = true
      await Promise.resolve() // flush microtasks
      await Promise.resolve()
      expect(mockNotifInfo).toHaveBeenCalled()
      expect(mockFetchBoard).toHaveBeenCalledWith(5)
      expect(mockFetchColumns).toHaveBeenCalledWith(5)
      expect(mockFetchCards).toHaveBeenCalled()
    })

    it('ne re-fetch pas à la première connexion', async () => {
      const store = useRealtimeStore()
      store.connect(1)
      emitStatus(true, false) // isReconnect = false
      await Promise.resolve()
      expect(mockFetchBoard).not.toHaveBeenCalled()
    })
  })

  // ── Filtrage actor_id ──────────────────────────────────────────────────────

  describe('filtrage actor_id', () => {
    it('ignore les événements de l\'utilisateur courant (id=1)', () => {
      useRealtimeStore().connect(1)
      emit('card.created', { id: 10 }, 1)
      expect(mockCardCreated).not.toHaveBeenCalled()
    })

    it('traite les événements des autres utilisateurs (id≠1)', () => {
      useRealtimeStore().connect(1)
      emit('card.created', { id: 10 }, 42)
      expect(mockCardCreated).toHaveBeenCalledWith({ id: 10 })
    })
  })

  // ── Dispatch cartes ────────────────────────────────────────────────────────

  describe('dispatch — cartes', () => {
    beforeEach(() => { useRealtimeStore().connect(1) })

    it('card.created → wsHandleCardCreated',      () => { emit('card.created',   { id: 5 }); expect(mockCardCreated).toHaveBeenCalledWith({ id: 5 }) })
    it('card.updated → wsHandleCardUpdated',      () => { emit('card.updated',   { id: 5 }); expect(mockCardUpdated).toHaveBeenCalledWith({ id: 5 }) })
    it('card.moved → wsHandleCardMoved',          () => { emit('card.moved',     { id: 5, from_column_id: 1, column_id: 2 }); expect(mockCardMoved).toHaveBeenCalled() })
    it('card.deleted → wsHandleCardDeleted',      () => { emit('card.deleted',   { card_id: 5, column_id: 1 }); expect(mockCardDeleted).toHaveBeenCalledWith({ card_id: 5, column_id: 1 }) })
    it('card.reordered → wsHandleCardsReordered', () => { emit('card.reordered', { column_id: 1, cards: [] }); expect(mockCardsReordered).toHaveBeenCalled() })
    it('card.archived → wsHandleCardDeleted',     () => { emit('card.archived',  { card_id: 5, column_id: 1 }); expect(mockCardDeleted).toHaveBeenCalledWith({ card_id: 5, column_id: 1 }) })
    it('card.restored → wsHandleCardCreated',     () => { emit('card.restored',  { id: 5, column_id: 1 }); expect(mockCardCreated).toHaveBeenCalled() })
  })

  // ── Dispatch colonnes ──────────────────────────────────────────────────────

  describe('dispatch — colonnes', () => {
    beforeEach(() => { useRealtimeStore().connect(1) })

    it('column.created → wsHandleColumnCreated',     () => { emit('column.created',   { id: 1 }); expect(mockColCreated).toHaveBeenCalledWith({ id: 1 }) })
    it('column.updated → wsHandleColumnUpdated',     () => { emit('column.updated',   { id: 1, name: 'X' }); expect(mockColUpdated).toHaveBeenCalled() })
    it('column.deleted → wsHandleColumnDeleted',     () => { emit('column.deleted',   { column_id: 1 }); expect(mockColDeleted).toHaveBeenCalledWith({ column_id: 1 }) })
    it('column.reordered → wsHandleColumnsReordered',() => { emit('column.reordered', { columns: [] }); expect(mockColsReordered).toHaveBeenCalled() })
    it('column.archived → wsHandleColumnDeleted',    () => { emit('column.archived',  { column_id: 2 }); expect(mockColDeleted).toHaveBeenCalledWith({ column_id: 2 }) })
    it('column.restored → wsHandleColumnCreated',    () => { emit('column.restored',  { id: 2 }); expect(mockColCreated).toHaveBeenCalled() })
  })

  // ── Dispatch board ─────────────────────────────────────────────────────────

  describe('dispatch — board', () => {
    it('board.renamed → wsHandleBoardRenamed', () => {
      useRealtimeStore().connect(1)
      emit('board.renamed', { board_id: 1, name: 'Nouveau' })
      expect(mockBoardRenamed).toHaveBeenCalledWith({ board_id: 1, name: 'Nouveau' })
    })
  })

  // ── Événements inconnus ────────────────────────────────────────────────────

  it('ne lève pas d\'erreur pour un type inconnu', () => {
    useRealtimeStore().connect(1)
    expect(() => emit('unknown.event', {})).not.toThrow()
  })
})
