import { defineStore } from 'pinia'
import { ref } from 'vue'
import { wsService } from '@/services/websocket.service'
import { useAuthStore }         from '@/stores/auth.store'
import { useBoardStore }        from '@/stores/board.store'
import { useColumnStore }       from '@/stores/column.store'
import { useCardStore }         from '@/stores/card.store'
import { useNotificationStore } from '@/stores/notification.store'

export const useRealtimeStore = defineStore('realtime', () => {
  const connected = ref(false)
  let _boardId      = null
  let _unsubMsg     = null
  let _unsubStatus  = null

  function connect(boardId) {
    const auth = useAuthStore()
    if (!auth.token) return

    _boardId = boardId
    wsService.connect(boardId, auth.token)

    _unsubMsg = wsService.onMessage(event => {
      // Ignorer les événements déclenchés par l'utilisateur courant
      // (la mutation HTTP a déjà mis à jour le store local)
      if (event.actor_id === auth.currentUser?.id) return
      _dispatch(event)
    })

    _unsubStatus = wsService.onStatusChange(({ connected: isConnected, isReconnect }) => {
      connected.value = isConnected
      if (isConnected && isReconnect) _handleReconnect()
    })

    // Optimiste : on considère le WS connecté dès l'appel (onopen est asynchrone
    // mais la connexion localhost réussit quasi-instantanément).
    // onStatusChange corrigera si la connexion échoue (onclose → connected: false).
    connected.value = true
  }

  function disconnect() {
    wsService.disconnect()
    _unsubMsg?.()
    _unsubStatus?.()
    _unsubMsg    = null
    _unsubStatus = null
    connected.value = false
    _boardId = null
  }

  async function _handleReconnect() {
    const notif = useNotificationStore()
    notif.info('Connexion rétablie — synchronisation en cours…')

    const boardStore  = useBoardStore()
    const columnStore = useColumnStore()
    const cardStore   = useCardStore()

    await boardStore.fetchBoard(_boardId)
    await columnStore.fetchColumns(_boardId)

    const loadedColumns = Object.keys(cardStore.cardsByColumn).map(Number)
    await Promise.all(loadedColumns.map(colId => cardStore.fetchCards(_boardId, colId)))
  }

  function _dispatch({ type, data }) {
    const cardStore   = useCardStore()
    const columnStore = useColumnStore()
    const boardStore  = useBoardStore()

    switch (type) {
      // ── Cartes ─────────────────────────────────────────────────────────────
      case 'card.created':   cardStore.wsHandleCardCreated(data);  break
      case 'card.updated':   cardStore.wsHandleCardUpdated(data);  break
      case 'card.moved':     cardStore.wsHandleCardMoved(data);    break
      case 'card.deleted':   cardStore.wsHandleCardDeleted(data);  break
      case 'card.reordered': cardStore.wsHandleCardsReordered(data); break
      case 'card.archived':  cardStore.wsHandleCardDeleted(data);  break
      case 'card.restored':  cardStore.wsHandleCardCreated(data);  break

      // ── Colonnes ───────────────────────────────────────────────────────────
      case 'column.created':   columnStore.wsHandleColumnCreated(data);   break
      case 'column.updated':   columnStore.wsHandleColumnUpdated(data);   break
      case 'column.deleted':   columnStore.wsHandleColumnDeleted(data);   break
      case 'column.reordered': columnStore.wsHandleColumnsReordered(data); break
      case 'column.archived':  columnStore.wsHandleColumnDeleted(data);   break
      case 'column.restored':  columnStore.wsHandleColumnCreated(data);   break

      // ── Board ──────────────────────────────────────────────────────────────
      case 'board.renamed': boardStore.wsHandleBoardRenamed(data); break

      // assignee / label : marque la carte comme périmée pour forcer un re-fetch
      case 'assignee.added':
      case 'assignee.removed':
      case 'label.attached':
      case 'label.detached':
        _refreshCard(data); break

      default: break
    }
  }

  function _refreshCard({ card_id, column_id }) {
    const cardStore = useCardStore()
    const col = cardStore.cardsByColumn[column_id]
    if (!col) return
    const idx = col.findIndex(c => c.id === card_id)
    if (idx !== -1) col[idx] = { ...col[idx], _stale: true }
  }

  return { connected, connect, disconnect }
})
