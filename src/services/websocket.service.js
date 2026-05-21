const WS_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000')
  .replace(/^http/, 'ws')

const MAX_ATTEMPTS  = 5
const BASE_DELAY_MS = 2000

class WebSocketService {
  #ws              = null
  #boardId         = null
  #token           = null
  #listeners       = new Set()
  #statusListeners = new Set()
  #attempts        = 0
  #shouldReconnect = false
  #retryTimer      = null

  connect(boardId, token) {
    this.#boardId        = boardId
    this.#token          = token
    this.#shouldReconnect = true
    this.#attempts       = 0
    this.#open()
  }

  #open() {
    if (this.#ws) {
      this.#ws.onclose = null
      this.#ws.close()
    }
    const url = `${WS_BASE}/ws/boards/${this.#boardId}?token=${this.#token}`
    this.#ws = new WebSocket(url)

    this.#ws.onopen = () => {
      const isReconnect = this.#attempts > 0
      this.#attempts = 0
      this.#statusListeners.forEach(fn => fn({ connected: true, isReconnect }))
    }

    this.#ws.onmessage = ({ data }) => {
      try {
        const event = JSON.parse(data)
        this.#listeners.forEach(fn => fn(event))
      } catch {}
    }

    this.#ws.onclose = ({ code }) => {
      this.#statusListeners.forEach(fn => fn({ connected: false }))
      if (!this.#shouldReconnect || code === 4001 || code === 4003) return
      if (this.#attempts >= MAX_ATTEMPTS) return
      this.#attempts++
      const delay = BASE_DELAY_MS * this.#attempts
      this.#retryTimer = setTimeout(() => this.#open(), delay)
    }

    this.#ws.onerror = () => this.#ws?.close()
  }

  disconnect() {
    this.#shouldReconnect = false
    clearTimeout(this.#retryTimer)
    if (this.#ws) {
      this.#ws.onclose = null
      this.#ws.close()
      this.#ws = null
    }
    this.#listeners.clear()
    this.#statusListeners.clear()
  }

  /** Retourne une fonction de désabonnement. */
  onMessage(callback) {
    this.#listeners.add(callback)
    return () => this.#listeners.delete(callback)
  }

  /**
   * Appelé lors de tout changement de statut de connexion.
   * `callback({ connected: boolean, isReconnect: boolean })`
   * Retourne une fonction de désabonnement.
   */
  onStatusChange(callback) {
    this.#statusListeners.add(callback)
    return () => this.#statusListeners.delete(callback)
  }

  get connected() {
    return this.#ws?.readyState === WebSocket.OPEN
  }
}

export const wsService = new WebSocketService()
