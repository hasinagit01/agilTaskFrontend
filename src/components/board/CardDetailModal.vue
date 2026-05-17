<template>
  <v-dialog v-model="model" max-width="600" scrollable>
    <v-card v-if="card">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-semibold">Détail de la carte</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="model = false" />
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-6">
        <!-- Titre -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis font-weight-semibold d-block mb-1">TITRE</label>
          <v-text-field
            v-model="form.title"
            hide-details
          />
        </div>

        <!-- Description -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis font-weight-semibold d-block mb-1">DESCRIPTION</label>
          <v-textarea
            v-model="form.description"
            rows="3"
            hide-details
            placeholder="Ajouter une description..."
          />
        </div>

        <!-- Date d'échéance -->
        <div class="mb-4">
          <label class="text-caption text-medium-emphasis font-weight-semibold d-block mb-1">DATE D'ÉCHÉANCE</label>
          <v-text-field
            v-model="form.due_date"
            type="date"
            hide-details
            clearable
          />
        </div>

        <!-- Labels -->
        <div v-if="card.labels?.length" class="mb-4">
          <label class="text-caption text-medium-emphasis font-weight-semibold d-block mb-2">LABELS</label>
          <div class="d-flex flex-wrap gap-1">
            <v-chip
              v-for="label in card.labels"
              :key="label.id"
              size="small"
              :color="label.color"
              variant="flat"
              closable
              @click:close="$emit('detach-label', { card, labelId: label.id })"
            >
              {{ label.name }}
            </v-chip>
          </div>
        </div>

        <!-- Assignees -->
        <div class="mb-2">
          <label class="text-caption text-medium-emphasis font-weight-semibold d-block mb-2">ASSIGNÉS</label>
          <div v-if="card.assignees?.length" class="d-flex flex-wrap gap-2 mb-2">
            <v-chip
              v-for="a in card.assignees"
              :key="a.user_id"
              size="small"
              variant="tonal"
              color="primary"
              closable
              @click:close="$emit('unassign', { card, userId: a.user_id })"
            >
              {{ a.email }}
            </v-chip>
          </div>
          <v-select
            v-if="assignableMembers.length"
            v-model="selectedMember"
            :items="assignableMembers"
            item-title="email"
            item-value="user_id"
            placeholder="Assigner un membre..."
            hide-details
            clearable
            @update:model-value="onAssign"
          />
          <p v-else-if="!card.assignees?.length" class="text-caption text-medium-emphasis">
            Aucun membre disponible
          </p>
        </div>
      </v-card-text>

      <v-divider />
      <v-card-actions class="pa-4 gap-2">
        <v-btn
          color="error"
          variant="text"
          prepend-icon="mdi-delete-outline"
          :loading="deleting"
          @click="$emit('delete', card)"
        >
          Supprimer
        </v-btn>
        <v-spacer />
        <v-btn variant="text" @click="model = false">Annuler</v-btn>
        <v-btn color="primary" variant="flat" :loading="saving" @click="handleSave">
          Enregistrer
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useMemberStore } from '@/stores/member.store'

const model = defineModel({ type: Boolean, default: false })

const props = defineProps({
  card:     { type: Object, default: null },
  saving:   { type: Boolean, default: false },
  deleting: { type: Boolean, default: false },
})
const emit = defineEmits(['save', 'delete', 'detach-label', 'unassign', 'assign'])

const memberStore = useMemberStore()

const assignableMembers = computed(() => {
  const assignedIds = new Set((props.card?.assignees || []).map(a => a.user_id))
  return memberStore.members.filter(m => !assignedIds.has(m.user_id))
})

const selectedMember = ref(null)
const form = ref({ title: '', description: '', due_date: null })

watch(() => props.card, (c) => {
  if (c) {
    form.value = {
      title:       c.title       || '',
      description: c.description || '',
      due_date:    c.due_date    || null,
    }
    selectedMember.value = null
  }
}, { immediate: true })

function onAssign(userId) {
  if (!userId) return
  emit('assign', { card: props.card, userId })
  selectedMember.value = null
}

function handleSave() {
  if (!form.value.title.trim()) return
  emit('save', { card: props.card, data: { ...form.value } })
}
</script>
