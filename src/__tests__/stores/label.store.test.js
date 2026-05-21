import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLabelStore } from '@/stores/label.store'

vi.mock('@/services/label.service', () => ({
  labelService: {
    getAll: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({ success: vi.fn(), error: vi.fn() }),
}))

import { labelService } from '@/services/label.service'

const MOCK_LABELS = [
  { id: 1, name: 'Bug',     color: '#ef4444' },
  { id: 2, name: 'Feature', color: '#22c55e' },
]

describe('label.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== fetchLabels() =====
  describe('fetchLabels()', () => {
    it('charge et stocke les labels', async () => {
      labelService.getAll.mockResolvedValue({ data: MOCK_LABELS })

      const store = useLabelStore()
      await store.fetchLabels(1)

      expect(store.labels).toEqual(MOCK_LABELS)
      expect(store.loading).toBe(false)
    })

    it('garde la liste vide en cas d\'erreur', async () => {
      labelService.getAll.mockRejectedValue({ message: 'Erreur réseau' })

      const store = useLabelStore()
      await store.fetchLabels(1)

      expect(store.labels).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  // ===== createLabel() =====
  describe('createLabel()', () => {
    it('ajoute le label à la liste et le retourne', async () => {
      const newLabel = { id: 3, name: 'Urgent', color: '#f59e0b' }
      labelService.create.mockResolvedValue({ data: newLabel })

      const store  = useLabelStore()
      const result = await store.createLabel(1, { name: 'Urgent', color: '#f59e0b' })

      expect(result).toEqual(newLabel)
      expect(store.labels).toContainEqual(newLabel)
    })

    it('retourne null en cas d\'erreur', async () => {
      labelService.create.mockRejectedValue({ message: 'Erreur' })

      const store  = useLabelStore()
      const result = await store.createLabel(1, { name: 'Fail' })

      expect(result).toBeNull()
      expect(store.labels).toHaveLength(0)
    })
  })

  // ===== removeLabel() =====
  describe('removeLabel()', () => {
    it('retire le label de la liste', async () => {
      labelService.getAll.mockResolvedValue({ data: MOCK_LABELS })
      labelService.remove.mockResolvedValue({})

      const store = useLabelStore()
      await store.fetchLabels(1)
      const result = await store.removeLabel(1, 1)

      expect(result).toBe(true)
      expect(store.labels).toHaveLength(1)
      expect(store.labels[0].id).toBe(2)
    })

    it('retourne false en cas d\'erreur', async () => {
      labelService.remove.mockRejectedValue({ message: 'Erreur' })

      const store  = useLabelStore()
      const result = await store.removeLabel(1, 99)

      expect(result).toBe(false)
    })
  })

  // ===== reset() =====
  describe('reset()', () => {
    it('vide la liste des labels', async () => {
      labelService.getAll.mockResolvedValue({ data: MOCK_LABELS })

      const store = useLabelStore()
      await store.fetchLabels(1)
      store.reset()

      expect(store.labels).toEqual([])
    })
  })
})
