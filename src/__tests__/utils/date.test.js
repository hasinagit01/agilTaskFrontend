import { describe, it, expect } from 'vitest'
import { formatDate, formatDateShort, isOverdue, isDueSoon, formatRelativeTime } from '@/utils/date'

describe('utils/date', () => {

  // ===== formatDate() =====
  describe('formatDate()', () => {
    it('retourne une chaîne non vide pour une date valide', () => {
      const result = formatDate('2024-06-15')
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('retourne une chaîne vide pour null', () => {
      expect(formatDate(null)).toBe('')
    })

    it('retourne une chaîne vide pour undefined', () => {
      expect(formatDate(undefined)).toBe('')
    })
  })

  // ===== formatDateShort() =====
  describe('formatDateShort()', () => {
    it('retourne une chaîne plus courte que formatDate', () => {
      const full  = formatDate('2024-06-15')
      const short = formatDateShort('2024-06-15')
      expect(short.length).toBeLessThanOrEqual(full.length)
    })

    it('retourne une chaîne vide pour null', () => {
      expect(formatDateShort(null)).toBe('')
    })
  })

  // ===== isOverdue() =====
  describe('isOverdue()', () => {
    it('retourne true pour une date dans le passé', () => {
      const past = new Date(Date.now() - 86400 * 1000).toISOString()
      expect(isOverdue(past)).toBe(true)
    })

    it('retourne false pour une date dans le futur', () => {
      const future = new Date(Date.now() + 86400 * 1000).toISOString()
      expect(isOverdue(future)).toBe(false)
    })

    it('retourne false pour null', () => {
      expect(isOverdue(null)).toBe(false)
    })
  })

  // ===== isDueSoon() =====
  describe('isDueSoon()', () => {
    it('retourne true si la date est dans la fenêtre (1 jour, seuil 3)', () => {
      const tomorrow = new Date(Date.now() + 86400 * 1000).toISOString()
      expect(isDueSoon(tomorrow, 3)).toBe(true)
    })

    it('retourne false si la date est hors de la fenêtre (5 jours, seuil 3)', () => {
      const farFuture = new Date(Date.now() + 5 * 86400 * 1000).toISOString()
      expect(isDueSoon(farFuture, 3)).toBe(false)
    })

    it('retourne false pour une date déjà passée', () => {
      const past = new Date(Date.now() - 86400 * 1000).toISOString()
      expect(isDueSoon(past, 3)).toBe(false)
    })

    it('retourne false pour null', () => {
      expect(isDueSoon(null)).toBe(false)
    })
  })

  // ===== formatRelativeTime() =====
  describe('formatRelativeTime()', () => {
    it('retourne "à l\'instant" pour moins de 60 secondes', () => {
      const recent = new Date(Date.now() - 30 * 1000).toISOString()
      expect(formatRelativeTime(recent)).toBe('à l\'instant')
    })

    it('retourne "il y a X min" pour des minutes', () => {
      const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      expect(formatRelativeTime(fiveMinAgo)).toBe('il y a 5 min')
    })

    it('retourne "il y a X h" pour des heures', () => {
      const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000).toISOString()
      expect(formatRelativeTime(threeHoursAgo)).toBe('il y a 3 h')
    })

    it('retourne "il y a X j" pour des jours', () => {
      const twoDaysAgo = new Date(Date.now() - 2 * 86400 * 1000).toISOString()
      expect(formatRelativeTime(twoDaysAgo)).toBe('il y a 2 j')
    })

    it('retourne une chaîne vide pour null', () => {
      expect(formatRelativeTime(null)).toBe('')
    })
  })
})
