<template>
  <div
    ref="columnEl"
    class="kanban-column"
    :class="{
      'drag-over': isDragOver,
      'drop-left':  columnDropSide === 'left'  && !isColumnDragging,
      'drop-right': columnDropSide === 'right' && !isColumnDragging,
    }"
    @dragover="onDragOver"
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- En-tête de colonne -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div v-if="!editingName" class="d-flex align-center gap-2 flex-grow-1">
        <v-icon
          icon="mdi-drag-vertical"
          size="small"
          class="column-drag-handle"
          draggable="true"
          @dragstart.stop="onColumnDragStart"
          @dragend.stop="onColumnDragEnd"
        />
        <span class="text-body-1 font-weight-semibold">{{ column.name }}</span>
        <v-chip size="x-small" color="default" variant="tonal">
          {{ cards.length }}
        </v-chip>
      </div>
      <v-text-field
        v-else
        v-model="nameInput"
        hide-details
        autofocus
        class="flex-grow-1 mr-2"
        @keyup.enter="saveColumnName"
        @keyup.esc="cancelEditName"
        @blur="saveColumnName"
      />

      <v-menu v-if="!editingName">
        <template #activator="{ props: menuProps }">
          <v-btn icon="mdi-dots-vertical" variant="text" size="x-small" v-bind="menuProps" />
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-pencil-outline" title="Renommer" base-color="primary" @click="startEditName" />
          <v-list-item prepend-icon="mdi-archive-arrow-down-outline" title="Archiver" base-color="primary" @click="$emit('archive-column', { boardId: props.column.board_id, columnId: props.column.id })" />
          <v-divider />
          <v-list-item prepend-icon="mdi-delete-outline" title="Supprimer" base-color="error" @click="$emit('delete', column)" />
        </v-list>
      </v-menu>
    </div>

    <!-- Cartes -->
    <div class="cards-container" ref="cardsContainer">
      <template v-for="(card, index) in sortedCards" :key="card.id">
        <div v-if="isDragOver && dragOverCardIndex === index" class="drop-indicator" />
        <div class="card-item">
          <KanbanCard
            :card="card"
            :column-id="column.id"
            @open="$emit('open-card', $event)"
            @archive="(card) => $emit('archive-card', { boardId: props.column.board_id, columnId: props.column.id, cardId: card.id })"
          />
        </div>
      </template>
      <div v-if="isDragOver && dragOverCardIndex === sortedCards.length" class="drop-indicator" />
    </div>

    <!-- Ajouter une carte -->
    <div v-if="!addingCard" class="mt-2">
      <v-btn
        variant="text"
        size="small"
        prepend-icon="mdi-plus"
        block
        @click="addingCard = true"
      >
        Ajouter une carte
      </v-btn>
    </div>
    <div v-else class="mt-2">
      <v-textarea
        v-model="newCardTitle"
        placeholder="Titre de la carte..."
        rows="2"
        auto-grow
        hide-details
        autofocus
        class="mb-2"
        @keyup.enter.ctrl="submitNewCard"
        @keyup.esc="cancelNewCard"
      />
      <div class="d-flex gap-2">
        <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-check" :loading="savingCard" @click="submitNewCard">
          Ajouter
        </v-btn>
        <v-btn variant="text" size="small" prepend-icon="mdi-close" @click="cancelNewCard">Annuler</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import KanbanCard from './KanbanCard.vue'

const props = defineProps({
  column: { type: Object, required: true },
  cards:  { type: Array,  default: () => [] },
})
const emit = defineEmits(['add-card', 'rename', 'delete', 'open-card', 'drop-card', 'reorder-columns', 'reorder-cards', 'archive-card', 'archive-column'])

const columnEl       = ref(null)
const cardsContainer = ref(null)

const sortedCards = computed(() =>
  [...props.cards].sort((a, b) => a.position - b.position)
)

// Ajout carte
const addingCard   = ref(false)
const newCardTitle = ref('')
const savingCard   = ref(false)

async function submitNewCard() {
  if (!newCardTitle.value.trim()) return
  savingCard.value = true
  await emit('add-card', { columnId: props.column.id, title: newCardTitle.value.trim() })
  savingCard.value = false
  cancelNewCard()
}

function cancelNewCard() {
  newCardTitle.value = ''
  addingCard.value   = false
}

// Renommage
const editingName = ref(false)
const nameInput   = ref('')

function startEditName() {
  nameInput.value   = props.column.name
  editingName.value = true
}

async function saveColumnName() {
  if (nameInput.value.trim() && nameInput.value !== props.column.name) {
    emit('rename', { columnId: props.column.id, name: nameInput.value.trim() })
  }
  editingName.value = false
}

function cancelEditName() {
  editingName.value = false
}

// Column drag (handle)
const isColumnDragging = ref(false)
const columnDropSide   = ref(null) // 'left' | 'right' | null

function onColumnDragStart(e) {
  isColumnDragging.value = true
  e.dataTransfer.setData('column-drag-id', String(props.column.id))
  e.dataTransfer.effectAllowed = 'move'
}

function onColumnDragEnd() {
  isColumnDragging.value = false
}

// Card drag & drop
const isDragOver        = ref(false)
const dragOverCardIndex = ref(-1)
let _dragCount = 0

function onDragEnter(e) {
  if (isColumnDragging.value) return
  _dragCount++
  if (e.dataTransfer.types.includes('card-drag-id')) {
    isDragOver.value = true
  }
}

function onDragLeave() {
  if (isColumnDragging.value) return
  if (--_dragCount === 0) {
    isDragOver.value        = false
    dragOverCardIndex.value = -1
    columnDropSide.value    = null
  }
}

function onDragOver(e) {
  const isCard   = e.dataTransfer.types.includes('card-drag-id')
  const isColumn = e.dataTransfer.types.includes('column-drag-id')
  if (!isCard && !isColumn) return
  e.preventDefault()

  if (isCard) {
    const container = cardsContainer.value
    if (!container) { dragOverCardIndex.value = sortedCards.value.length; return }
    const cardEls = container.querySelectorAll('.card-item')
    let newIndex = sortedCards.value.length
    for (let i = 0; i < cardEls.length; i++) {
      const rect = cardEls[i].getBoundingClientRect()
      if (e.clientY < rect.top + rect.height / 2) { newIndex = i; break }
    }
    dragOverCardIndex.value = newIndex
  } else if (isColumn && columnEl.value && !isColumnDragging.value) {
    // Determine which half of the column the cursor is on
    const rect = columnEl.value.getBoundingClientRect()
    columnDropSide.value = e.clientX < rect.left + rect.width / 2 ? 'left' : 'right'
  }
}

function onDrop(e) {
  const dropSide      = columnDropSide.value
  const savedDropIdx  = dragOverCardIndex.value
  _dragCount = 0
  isDragOver.value        = false
  dragOverCardIndex.value = -1
  columnDropSide.value    = null

  if (e.dataTransfer.types.includes('column-drag-id')) {
    const fromColumnId = parseInt(e.dataTransfer.getData('column-drag-id'))
    if (fromColumnId !== props.column.id) {
      emit('reorder-columns', { fromColumnId, toColumnId: props.column.id, side: dropSide || 'left' })
    }
    return
  }

  const cardId       = parseInt(e.dataTransfer.getData('card-drag-id'))
  const fromColumnId = parseInt(e.dataTransfer.getData('card-column-id'))
  if (!cardId) return

  if (fromColumnId === props.column.id) {
    const cards = sortedCards.value
    const dragIndex = cards.findIndex(c => c.id === cardId)
    if (dragIndex === -1) return

    const dropIndex = savedDropIdx === -1 ? cards.length : savedDropIdx
    if (dropIndex === dragIndex || dropIndex === dragIndex + 1) return

    const reordered = [...cards]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex > dragIndex ? dropIndex - 1 : dropIndex, 0, moved)
    emit('reorder-cards', { columnId: props.column.id, cardIds: reordered.map(c => c.id) })
  } else {
    emit('drop-card', { cardId, fromColumnId, toColumnId: props.column.id })
  }
}
</script>

<style scoped>
.kanban-column {
  background: rgba(var(--v-theme-primary), 0.06);
  border-radius: 12px;
  padding: 12px;
  min-width: 280px;
  width: 280px;
  flex-shrink: 0;
  transition: background 0.1s ease, box-shadow 0.1s ease;
}
.cards-container {
  min-height: 8px;
}
.column-drag-handle {
  cursor: grab;
  color: rgba(var(--v-theme-on-surface), 0.3);
  flex-shrink: 0;
}
.column-drag-handle:hover {
  color: rgba(var(--v-theme-on-surface), 0.6);
}
.card-item {
  position: relative;
}
.drop-indicator {
  height: 2px;
  background: rgb(var(--v-theme-primary));
  border-radius: 2px;
  margin: 3px 0;
}

@media (max-width: 600px) {
  .kanban-column {
    width: 100%;
    min-width: unset;
  }
}

/* Card drag hover */
.kanban-column.drag-over {
  background: rgba(var(--v-theme-primary), 0.1);
  outline: 2px dashed rgb(var(--v-theme-primary));
  outline-offset: -2px;
}

/* Column drag: indicator on left or right side */
.kanban-column.drop-left {
  box-shadow: -4px 0 0 0 rgb(var(--v-theme-primary));
}
.kanban-column.drop-right {
  box-shadow: 4px 0 0 0 rgb(var(--v-theme-primary));
}
</style>
