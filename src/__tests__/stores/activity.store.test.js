import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useActivityStore } from '@/stores/activity.store'

vi.mock('@/services/activity.service', () => ({
  activityService: {
    getBoardActivity: vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({ error: vi.fn() }),
}))

import { activityService } from '@/services/activity.service'

const MOCK_ACTIVITIES = [
  { id: 1, action: 'created', entity_type: 'card', entity_name: 'Card A', actor: { id: 1, email: 'a@b.com' }, created_at: '2026-01-01T00:00:00' },
  { id: 2, action: 'moved',   entity_type: 'card', entity_name: 'Card A', actor: { id: 1, email: 'a@b.com' }, created_at: '2026-01-01T00:01:00' },
]

describe('activity.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('fetchActivities()', () => {
    it('charge et stocke les activités', async () => {
      activityService.getBoardActivity.mockResolvedValue({ data: MOCK_ACTIVITIES })

      const store = useActivityStore()
      await store.fetchActivities(1)

      expect(store.activities).toHaveLength(2)
      expect(store.loading).toBe(false)
    })

    it('reste vide en cas d\'erreur', async () => {
      activityService.getBoardActivity.mockRejectedValue({ message: 'Erreur' })

      const store = useActivityStore()
      await store.fetchActivities(1)

      expect(store.activities).toEqual([])
    })
  })

  describe('reset()', () => {
    it('vide les activités', async () => {
      activityService.getBoardActivity.mockResolvedValue({ data: MOCK_ACTIVITIES })

      const store = useActivityStore()
      await store.fetchActivities(1)
      store.reset()

      expect(store.activities).toEqual([])
    })
  })
})
