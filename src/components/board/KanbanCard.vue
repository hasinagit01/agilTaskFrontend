<template>
  <v-card
    rounded="lg"
    elevation="0"
    border
    class="kanban-card mb-2"
    :class="{ 'is-dragging': isDragging }"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="isDragging = false"
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
          :color="isOverdue(card.due_date) ? 'error' : isDueSoon(card.due_date) ? 'warning' : 'default'"
          variant="tonal"
          prepend-icon="mdi-calendar"
        >
          {{ formatDateShort(card.due_date) }}
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
import { ref } from 'vue'
import { formatDateShort, isDueSoon, isOverdue } from '@/utils/date'

const props = defineProps({
  card:     { type: Object, required: true },
  columnId: { type: Number, required: true },
})
defineEmits(['open'])

const isDragging = ref(false)

function onDragStart(e) {
  isDragging.value = true
  e.dataTransfer.setData('card-drag-id',  String(props.card.id))
  e.dataTransfer.setData('card-column-id', String(props.columnId))
  e.dataTransfer.effectAllowed = 'move'
}
</script>

<style scoped>
.kanban-card {
  cursor: grab;
  transition: box-shadow 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}
.kanban-card:hover {
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.14), 0 1px 4px rgba(0,0,0,0.06) !important;
  transform: translateY(-1px);
}
.kanban-card:active {
  cursor: grabbing;
}
.kanban-card.is-dragging {
  opacity: 0.45;
  transform: rotate(1.5deg) scale(0.98);
  box-shadow: none !important;
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
