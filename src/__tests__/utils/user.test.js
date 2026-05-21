import { describe, it, expect } from 'vitest'
import { getUserFullName } from '@/utils/user'

describe('getUserFullName()', () => {
  it('retourne "Prénom Nom" si les deux sont présents', () => {
    expect(getUserFullName({ firstname: 'Jean', name: 'Dupont' })).toBe('Jean Dupont')
  })

  it('retourne uniquement le prénom si le nom est absent', () => {
    expect(getUserFullName({ firstname: 'Jean', name: null })).toBe('Jean')
  })

  it('retourne uniquement le nom si le prénom est absent', () => {
    expect(getUserFullName({ firstname: null, name: 'Dupont' })).toBe('Dupont')
  })

  it('retourne une chaîne vide si les deux sont absents', () => {
    expect(getUserFullName({ firstname: null, name: null })).toBe('')
  })

  it('retourne une chaîne vide pour un objet vide', () => {
    expect(getUserFullName({})).toBe('')
  })

  it('retourne une chaîne vide pour null', () => {
    expect(getUserFullName(null)).toBe('')
  })

  it('retourne une chaîne vide pour undefined', () => {
    expect(getUserFullName(undefined)).toBe('')
  })
})
