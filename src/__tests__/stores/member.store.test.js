import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMemberStore } from '@/stores/member.store'

vi.mock('@/services/member.service', () => ({
  memberService: {
    getAll:     vi.fn(),
    add:        vi.fn(),
    updateRole: vi.fn(),
    remove:     vi.fn(),
  },
}))

vi.mock('@/stores/notification.store', () => ({
  useNotificationStore: () => ({ success: vi.fn(), error: vi.fn() }),
}))

import { memberService } from '@/services/member.service'

const MOCK_MEMBERS = [
  { user_id: 1, email: 'alice@example.com', role: 'owner'  },
  { user_id: 2, email: 'bob@example.com',   role: 'member' },
]

describe('member.store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  // ===== fetchMembers() =====
  describe('fetchMembers()', () => {
    it('charge et stocke les membres', async () => {
      memberService.getAll.mockResolvedValue({ data: MOCK_MEMBERS })

      const store = useMemberStore()
      await store.fetchMembers(1)

      expect(store.members).toEqual(MOCK_MEMBERS)
      expect(store.loading).toBe(false)
    })

    it('garde la liste vide en cas d\'erreur', async () => {
      memberService.getAll.mockRejectedValue({ message: 'Erreur réseau' })

      const store = useMemberStore()
      await store.fetchMembers(1)

      expect(store.members).toEqual([])
      expect(store.loading).toBe(false)
    })
  })

  // ===== addMember() =====
  describe('addMember()', () => {
    it('recharge la liste après l\'ajout et retourne true', async () => {
      const newMember = { user_id: 3, email: 'carol@example.com', role: 'member' }
      memberService.add.mockResolvedValue({})
      memberService.getAll.mockResolvedValue({ data: [...MOCK_MEMBERS, newMember] })

      const store  = useMemberStore()
      const result = await store.addMember(1, { user_id: 3, role: 'member' })

      expect(result).toBe(true)
      expect(store.members).toHaveLength(3)
    })

    it('retourne null en cas d\'erreur', async () => {
      memberService.add.mockRejectedValue({ message: 'Déjà membre' })

      const store  = useMemberStore()
      const result = await store.addMember(1, { user_id: 99 })

      expect(result).toBeNull()
    })
  })

  // ===== updateMemberRole() =====
  describe('updateMemberRole()', () => {
    it('met à jour le rôle du membre dans la liste', async () => {
      const updated = { user_id: 2, email: 'bob@example.com', role: 'viewer' }
      memberService.getAll.mockResolvedValue({ data: MOCK_MEMBERS })
      memberService.updateRole.mockResolvedValue({ data: updated })

      const store = useMemberStore()
      await store.fetchMembers(1)
      const result = await store.updateMemberRole(1, 2, 'viewer')

      expect(result).toEqual(updated)
      const member = store.members.find(m => m.user_id === 2)
      expect(member.role).toBe('viewer')
    })

    it('retourne null en cas d\'erreur', async () => {
      memberService.updateRole.mockRejectedValue({ message: 'Erreur' })

      const store  = useMemberStore()
      const result = await store.updateMemberRole(1, 99, 'viewer')

      expect(result).toBeNull()
    })
  })

  // ===== removeMember() =====
  describe('removeMember()', () => {
    it('retire le membre de la liste', async () => {
      memberService.getAll.mockResolvedValue({ data: MOCK_MEMBERS })
      memberService.remove.mockResolvedValue({})

      const store = useMemberStore()
      await store.fetchMembers(1)
      const result = await store.removeMember(1, 2)

      expect(result).toBe(true)
      expect(store.members).toHaveLength(1)
      expect(store.members[0].user_id).toBe(1)
    })

    it('retourne false en cas d\'erreur', async () => {
      memberService.remove.mockRejectedValue({ message: 'Erreur' })

      const store  = useMemberStore()
      const result = await store.removeMember(1, 99)

      expect(result).toBe(false)
    })
  })

  // ===== reset() =====
  describe('reset()', () => {
    it('vide la liste des membres', async () => {
      memberService.getAll.mockResolvedValue({ data: MOCK_MEMBERS })

      const store = useMemberStore()
      await store.fetchMembers(1)
      store.reset()

      expect(store.members).toEqual([])
    })
  })
})
