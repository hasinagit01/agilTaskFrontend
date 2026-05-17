<template>
  <v-dialog v-model="model" max-width="440" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-semibold">Labels du board</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="model = false" />
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <!-- Créer un label -->
        <p class="text-body-2 font-weight-medium mb-3">Nouveau label</p>

        <v-text-field
          v-model="newName"
          placeholder="Nom du label..."
          hide-details
          class="mb-3"
          @keyup.enter="handleCreate"
        />

        <p class="text-caption text-medium-emphasis mb-2">Couleur</p>
        <div class="color-palette mb-4">
          <button
            v-for="color in LABEL_COLORS"
            :key="color"
            type="button"
            class="color-swatch"
            :class="{ 'color-swatch--selected': selectedColor === color }"
            :style="{ backgroundColor: color }"
            @click="selectedColor = color"
          />
        </div>

        <div class="label-actions mb-2">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-plus"
            :disabled="!newName.trim()"
            :loading="creating"
            @click="handleCreate"
          >
            Ajouter
          </v-btn>
          <v-chip v-if="newName.trim()" :color="selectedColor" size="small" variant="flat" label>
            {{ newName }}
          </v-chip>
        </div>

        <v-divider class="my-4" />

        <!-- Labels existants -->
        <p class="text-body-2 font-weight-medium mb-2">
          Labels existants
          <v-chip size="x-small" class="ml-1">{{ labelStore.labels.length }}</v-chip>
        </p>

        <div v-if="labelStore.loading" class="d-flex justify-center py-4">
          <v-progress-circular indeterminate size="24" />
        </div>

        <v-list v-else>
          <v-list-item
            v-for="label in labelStore.labels"
            :key="label.id"
            class="mb-1 px-0"
          >
            <template #prepend>
              <v-chip :color="label.color" size="small" variant="flat" label class="mr-2">
                {{ label.name }}
              </v-chip>
            </template>
            <template #append>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="x-small"
                color="error"
                :loading="deletingId === label.id"
                @click="handleDelete(label)"
              />
            </template>
          </v-list-item>

          <p v-if="!labelStore.labels.length" class="text-caption text-medium-emphasis py-2">
            Aucun label pour ce board.
          </p>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useLabelStore } from '@/stores/label.store'

const model = defineModel({ type: Boolean, default: false })

const props = defineProps({
  boardId: { type: Number, required: true },
})

const labelStore = useLabelStore()

const LABEL_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899',
  '#6b7280', '#1e293b',
]

const newName       = ref('')
const selectedColor = ref(LABEL_COLORS[0])
const creating      = ref(false)
const deletingId    = ref(null)

async function handleCreate() {
  if (!newName.value.trim()) return
  creating.value = true
  await labelStore.createLabel(props.boardId, {
    name:  newName.value.trim(),
    color: selectedColor.value,
  })
  creating.value = false
  newName.value  = ''
}

async function handleDelete(label) {
  deletingId.value = label.id
  await labelStore.removeLabel(props.boardId, label.id)
  deletingId.value = null
}
</script>

<style scoped>
.label-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.color-palette {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.color-swatch {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  outline: none;
}
.color-swatch:hover {
  transform: scale(1.2);
}
.color-swatch--selected {
  border-color: rgba(0, 0, 0, 0.35);
  transform: scale(1.2);
}
</style>
