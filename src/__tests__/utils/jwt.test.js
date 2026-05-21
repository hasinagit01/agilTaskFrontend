import { describe, it, expect } from 'vitest'
import { decodeJWT } from '@/utils/jwt'

function makeToken(payload) {
  return `header.${btoa(JSON.stringify(payload))}.signature`
}

describe('decodeJWT()', () => {
  it('décode le payload d\'un token valide', () => {
    const token  = makeToken({ sub: 1, exp: 9999999999 })
    const result = decodeJWT(token)
    expect(result).toEqual({ sub: 1, exp: 9999999999 })
  })

  it('retourne null pour un token sans séparateurs', () => {
    expect(decodeJWT('tokeninvalide')).toBeNull()
  })

  it('retourne null pour un payload base64 corrompu', () => {
    expect(decodeJWT('header.!!!.signature')).toBeNull()
  })

  it('retourne null pour null', () => {
    expect(decodeJWT(null)).toBeNull()
  })

  it('retourne null pour une chaîne vide', () => {
    expect(decodeJWT('')).toBeNull()
  })

  it('retourne null pour undefined', () => {
    expect(decodeJWT(undefined)).toBeNull()
  })
})
