<template>
  <div
    class="kanban-column"
    :class="{ 'drag-over': isDragOver }"
    @dragover.prevent
    @dragenter="onDragEnter"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- En-tête de colonne -->
    <div class="d-flex align-center justify-space-between mb-3">
      <div v-if="!editingName" class="d-flex align-center gap-2 flex-grow-1">
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
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" variant="text" size="x-small" v-bind="props" />
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-pencil-outline" title="Renommer" @click="startEditName" />
          <v-list-item prepend-icon="mdi-delete-outline" title="Supprimer" class="text-error" @click="$emit('delete', column)" />
        </v-list>
      </v-menu>
    </div>

    <!-- Cartes -->
    <div class="cards-container">
      <KanbanCard
        v-for="card in sortedCards"
        :key="card.id"
        :card="card"
        :column-id="column.id"
        @open="$emit('open-card', $event)"
      />
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
        <v-btn color="primary" size="small" variant="flat" :loading="savingCard" @click="submitNewCard">
          Ajouter
        </v-btn>
        <v-btn variant="text" size="small" @click="cancelNewCard">Annuler</v-btn>
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
const emit = defineEmits(['add-card', 'rename', 'delete', 'open-card', 'drop-card'])

const sortedCards = computed(() =>
  [...props.cards].sort((a, b) => a.position - b.position)
)

// Ajout carte
const addingCard    = ref(false)
const newCardTitle  = ref('')
const savingCard    = ref(false)

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
  nameInput.value  = props.column.name
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

// Drag & drop
const isDragOver = ref(false)
let _dragCount   = 0

function onDragEnter() {
  _dragCount++
  isDragOver.value = true
}

function onDragLeave() {
  if (--_dragCount === 0) isDragOver.value = false
}

function onDrop(e) {
  _dragCount = 0
  isDragOver.value = false
  const cardId       = parseInt(e.dataTransfer.getData('cardId'))
  const fromColumnId = parseInt(e.dataTransfer.getData('columnId'))
  if (!cardId || fromColumnId === props.column.id) return
  emit('drop-card', { cardId, fromColumnId, toColumnId: props.column.id })
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
}
.cards-container {
  min-height: 8px;
}

@media (max-width: 600px) {
  .kanban-column {
    width: 100%;
    min-width: unset;
  }
}
.kanban-column.drag-over {
  background: rgba(var(--v-theme-primary), 0.08);
  outline: 2px dashed rgb(var(--v-theme-primary));
  outline-offset: -2px;
}
</style>
