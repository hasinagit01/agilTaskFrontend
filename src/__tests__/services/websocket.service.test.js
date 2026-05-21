import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { wsService } from '@/services/websocket.service'

// ── Mock WebSocket natif ──────────────────────────────────────────────────────

let wsInstance = null

class MockWebSocket {
  static OPEN   = 1
  static CLOSED = 3

  constructor(url) {
    this.url         = url
    this.readyState  = MockWebSocket.OPEN
    this.onmessage   = null
    this.onclose     = null
    this.onerror     = null
    this.closeCalled = false
    wsInstance = this
  }

  close(code = 1000) {
    this.closeCalled = true
    this.readyState  = MockWebSocket.CLOSED
    this.onclose?.({ code })
  }
}

describe('WebSocketService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('WebSocket', MockWebSocket)
    wsInstance = null
    wsService.disconnect() // reset l'état du singleton
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  // ── connect() ──────────────────────────────────────────────────────────────

  it('connect() crée un WebSocket avec la bonne URL', () => {
    wsService.connect(42, 'my-token')
    expect(wsInstance).not.toBeNull()
    expect(wsInstance.url).toContain('/ws/boards/42')
    expect(wsInstance.url).toContain('token=my-token')
  })

  it('connect() remplace une connexion existante', () => {
    wsService.connect(1, 'tok-a')
    const first = wsInstance
    wsService.connect(2, 'tok-b')
    expect(wsInstance).not.toBe(first)
    expect(wsInstance.url).toContain('/ws/boards/2')
  })

  // ── onMessage() ───────────────────────────────────────────────────────────

  it('onMessage() déclenche le callback sur réception JSON valide', () => {
    wsService.connect(1, 'token')
    const cb = vi.fn()
    wsService.onMessage(cb)
    wsInstance.onmessage({ data: JSON.stringify({ type: 'card.created', data: {} }) })
    expect(cb).toHaveBeenCalledWith({ type: 'card.created', data: {} })
  })

  it('onMessage() ignore les données non-JSON', () => {
    wsService.connect(1, 'token')
    const cb = vi.fn()
    wsService.onMessage(cb)
    wsInstance.onmessage({ data: 'not-json' })
    expect(cb).not.toHaveBeenCalled()
  })

  it('onMessage() retourne une fonction de désabonnement', () => {
    wsService.connect(1, 'token')
    const cb = vi.fn()
    const unsub = wsService.onMessage(cb)
    unsub()
    wsInstance.onmessage({ data: JSON.stringify({ type: 'test' }) })
    expect(cb).not.toHaveBeenCalled()
  })

  it('plusieurs callbacks reçoivent le même événement', () => {
    wsService.connect(1, 'token')
    const cb1 = vi.fn()
    const cb2 = vi.fn()
    wsService.onMessage(cb1)
    wsService.onMessage(cb2)
    wsInstance.onmessage({ data: JSON.stringify({ type: 'ping' }) })
    expect(cb1).toHaveBeenCalledTimes(1)
    expect(cb2).toHaveBeenCalledTimes(1)
  })

  // ── disconnect() ──────────────────────────────────────────────────────────

  it('disconnect() ferme le WebSocket', () => {
    wsService.connect(1, 'token')
    const ws = wsInstance
    wsService.disconnect()
    expect(ws.closeCalled).toBe(true)
  })

  it('disconnect() vide les listeners', () => {
    wsService.connect(1, 'token')
    const cb = vi.fn()
    wsService.onMessage(cb)
    wsService.disconnect()
    wsService.connect(1, 'token')
    wsInstance.onmessage({ data: JSON.stringify({ type: 'test' }) })
    expect(cb).not.toHaveBeenCalled()
  })

  // ── connected ─────────────────────────────────────────────────────────────

  it('connected est true après connect()', () => {
    wsService.connect(1, 'token')
    expect(wsService.connected).toBe(true)
  })

  it('connected est false après disconnect()', () => {
    wsService.connect(1, 'token')
    wsService.disconnect()
    expect(wsService.connected).toBe(false)
  })

  // ── onStatusChange() ──────────────────────────────────────────────────────

  it('onStatusChange() reçoit connected:true à l\'ouverture', () => {
    const cb = vi.fn()
    wsService.connect(1, 'token')
    wsService.onStatusChange(cb)
    wsInstance.onopen()
    expect(cb).toHaveBeenCalledWith({ connected: true, isReconnect: false })
  })

  it('onStatusChange() reçoit connected:false à la fermeture', () => {
    const cb = vi.fn()
    wsService.connect(1, 'token')
    wsService.onStatusChange(cb)
    wsInstance.close(1000)
    expect(cb).toHaveBeenCalledWith({ connected: false })
  })

  it('onStatusChange() détecte une reconnexion (isReconnect:true)', () => {
    const cb = vi.fn()
    wsService.connect(1, 'token')
    wsService.onStatusChange(cb)
    // Simule une coupure puis reconnexion
    wsInstance.close(1006)          // onclose incrémente #attempts à 1
    vi.advanceTimersByTime(5_000)   // le retry crée un nouveau WS
    wsInstance.onopen()             // #attempts > 0 → isReconnect:true
    expect(cb).toHaveBeenCalledWith(expect.objectContaining({ connected: true, isReconnect: true }))
  })

  it('onStatusChange() retourne une fonction de désabonnement', () => {
    wsService.connect(1, 'token')
    const cb = vi.fn()
    const unsub = wsService.onStatusChange(cb)
    unsub()
    wsInstance.onopen()
    expect(cb).not.toHaveBeenCalled()
  })

  // ── Reconnexion ───────────────────────────────────────────────────────────

  it('ne se reconnecte pas avec code 4001 (token invalide)', () => {
    wsService.connect(1, 'token')
    const firstInstance = wsInstance
    wsInstance.close(4001)
    vi.advanceTimersByTime(10_000)
    expect(wsInstance).toBe(firstInstance) // pas de nouvelle instance
  })

  it('ne se reconnecte pas avec code 4003 (accès refusé)', () => {
    wsService.connect(1, 'token')
    const firstInstance = wsInstance
    wsInstance.close(4003)
    vi.advanceTimersByTime(10_000)
    expect(wsInstance).toBe(firstInstance)
  })

  it('se reconnecte sur fermeture normale', () => {
    wsService.connect(1, 'token')
    const firstInstance = wsInstance
    wsInstance.close(1006) // fermeture anormale
    vi.advanceTimersByTime(5_000)
    expect(wsInstance).not.toBe(firstInstance)
  })
})
