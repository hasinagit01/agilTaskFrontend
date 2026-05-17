<template>
  <v-card
    rounded="lg"
    elevation="0"
    border
    class="kanban-card mb-2"
    draggable="true"
    @dragstart="onDragStart"
    @click="$emit('open', card)"
  >
    <v-card-text class="pa-3">
      <p class="text-body-2 font-weight-medium mb-2">{{ card.title }}</p>

      <!-- Labels -->
      <div v-if="card.labels?.length" class="d-flex flex-wrap gap-1 mb-2">
        <v-chip
          v-for="label in card.labels"
          :key="label.id"
          size="x-small"
          :color="label.color"
          variant="flat"
        >
          {{ label.name }}
        </v-chip>
      </div>

      <!-- Footer -->
      <div class="d-flex align-center justify-space-between mt-1">
        <!-- Due date -->
        <v-chip
          v-if="card.due_date"
          size="x-small"
          :color="isDueSoon(card.due_date) ? 'warning' : 'default'"
          variant="tonal"
          prepend-icon="mdi-calendar"
        >
          {{ formatDate(card.due_date) }}
        </v-chip>
        <span v-else />

        <!-- Assignees -->
        <div v-if="card.assignees?.length" class="assignee-group">
          <v-avatar
            v-for="a in card.assignees.slice(0, 3)"
            :key="a.user_id"
            color="primary"
            size="22"
          >
            <span style="font-size:10px">{{ a.email[0].toUpperCase() }}</span>
          </v-avatar>
          <v-avatar v-if="card.assignees.length > 3" color="secondary" size="22">
            <span style="font-size:10px">+{{ card.assignees.length - 3 }}</span>
          </v-avatar>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  card:     { type: Object, required: true },
  columnId: { type: Number, required: true },
})
defineEmits(['open'])

function onDragStart(e) {
  e.dataTransfer.setData('cardId',   String(props.card.id))
  e.dataTransfer.setData('columnId', String(props.columnId))
  e.dataTransfer.effectAllowed = 'move'
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })
}

function isDueSoon(iso) {
  const diff = new Date(iso) - new Date()
  return diff >= 0 && diff < 3 * 24 * 60 * 60 * 1000
}
</script>

<style scoped>
.kanban-card {
  cursor: grab;
  transition: box-shadow 0.15s;
}
.kanban-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
}
.kanban-card:active {
  cursor: grabbing;
}
.assignee-group {
  display: flex;
}
.assignee-group .v-avatar {
  margin-left: -6px;
  border: 2px solid white;
}
.assignee-group .v-avatar:first-child {
  margin-left: 0;
}
</style>
