import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '@/stores/notification.store'

describe('notification.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // ===== État initial =====
  describe('état initial', () => {
    it('démarre avec des listes vides et unreadCount à 0', () => {
      const store = useNotificationStore()
      expect(store.notifications).toEqual([])
      expect(store.history).toEqual([])
      expect(store.unreadCount).toBe(0)
      expect(store.hasUnread).toBe(false)
    })
  })

  // ===== add() =====
  describe('add()', () => {
    it('ajoute une notification et l\'enregistre dans l\'historique', () => {
      const store = useNotificationStore()
      store.add({ message: 'Test', color: 'success' })

      expect(store.notifications).toHaveLength(1)
      expect(store.notifications[0].message).toBe('Test')
      expect(store.history).toHaveLength(1)
      expect(store.unreadCount).toBe(1)
      expect(store.hasUnread).toBe(true)
    })

    it('retire automatiquement la notification après le timeout', () => {
      const store = useNotificationStore()
      store.add({ message: 'Temporaire', timeout: 1000 })
      expect(store.notifications).toHaveLength(1)

      vi.advanceTimersByTime(1301)
      expect(store.notifications).toHaveLength(0)
    })

    it('conserve l\'entrée dans l\'historique après le timeout', () => {
      const store = useNotificationStore()
      store.add({ message: 'Gardé', timeout: 1000 })

      vi.advanceTimersByTime(1301)
      expect(store.history).toHaveLength(1)
    })

    it('place les nouvelles entrées en tête d\'historique', () => {
      const store = useNotificationStore()
      store.add({ message: 'Premier' })
      store.add({ message: 'Deuxième' })

      expect(store.history[0].message).toBe('Deuxième')
      expect(store.history[1].message).toBe('Premier')
    })

    it('limite l\'historique à 20 entrées', () => {
      const store = useNotificationStore()
      for (let i = 0; i < 25; i++) store.add({ message: `Notif ${i}` })

      expect(store.history).toHaveLength(20)
    })

    it('stocke la date de création dans l\'historique', () => {
      const store = useNotificationStore()
      store.add({ message: 'Horodaté' })

      expect(store.history[0].created_at).toBeTruthy()
      expect(new Date(store.history[0].created_at)).toBeInstanceOf(Date)
    })
  })

  // ===== remove() =====
  describe('remove()', () => {
    it('retire la notification de la liste active', () => {
      const store = useNotificationStore()
      const id = store.add({ message: 'À supprimer' })
      store.remove(id)

      expect(store.notifications).toHaveLength(0)
    })

    it('ne plante pas si l\'id est inconnu', () => {
      const store = useNotificationStore()
      expect(() => store.remove(999)).not.toThrow()
    })

    it('ne touche pas à l\'historique', () => {
      const store = useNotificationStore()
      const id = store.add({ message: 'Test' })
      store.remove(id)

      expect(store.history).toHaveLength(1)
    })
  })

  // ===== Raccourcis =====
  describe('success()', () => {
    it('crée une notification de couleur success', () => {
      const store = useNotificationStore()
      store.success('Opération réussie')

      expect(store.notifications[0].color).toBe('success')
      expect(store.notifications[0].message).toBe('Opération réussie')
    })
  })

  describe('error()', () => {
    it('crée une notification error avec timeout étendu à 6000ms', () => {
      const store = useNotificationStore()
      store.error('Erreur critique')

      expect(store.notifications[0].color).toBe('error')
      expect(store.notifications[0].timeout).toBe(6000)
    })
  })

  describe('warning()', () => {
    it('crée une notification warning', () => {
      const store = useNotificationStore()
      store.warning('Attention')

      expect(store.notifications[0].color).toBe('warning')
    })
  })

  describe('info()', () => {
    it('crée une notification info', () => {
      const store = useNotificationStore()
      store.info('Information')

      expect(store.notifications[0].color).toBe('info')
    })
  })

  // ===== markAllRead() =====
  describe('markAllRead()', () => {
    it('remet unreadCount à 0 sans effacer l\'historique', () => {
      const store = useNotificationStore()
      store.success('A')
      store.success('B')
      expect(store.unreadCount).toBe(2)

      store.markAllRead()

      expect(store.unreadCount).toBe(0)
      expect(store.hasUnread).toBe(false)
      expect(store.history).toHaveLength(2)
    })
  })

  // ===== clearHistory() =====
  describe('clearHistory()', () => {
    it('vide l\'historique et remet unreadCount à 0', () => {
      const store = useNotificationStore()
      store.success('Test 1')
      store.info('Test 2')

      store.clearHistory()

      expect(store.history).toEqual([])
      expect(store.unreadCount).toBe(0)
      expect(store.hasUnread).toBe(false)
    })
  })
})
