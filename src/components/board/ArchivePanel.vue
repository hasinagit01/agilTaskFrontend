<template>
  <v-dialog v-model="model" max-width="700" scrollable>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5">
        <span class="text-h6 font-weight-semibold">
          <v-icon icon="mdi-archive-outline" class="mr-2" />
          Archives
        </span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="model = false" />
      </v-card-title>

      <v-divider />

      <v-tabs v-model="tab" color="primary" class="px-4">
        <v-tab value="cards">
          Cartes
          <v-chip size="x-small" class="ml-2" variant="tonal">{{ archiveStore.archivedCards.length }}</v-chip>
        </v-tab>
        <v-tab value="columns">
          Colonnes
          <v-chip size="x-small" class="ml-2" variant="tonal">{{ archiveStore.archivedColumns.length }}</v-chip>
        </v-tab>
      </v-tabs>

      <v-card-text class="pa-0" style="min-height: 300px">
        <v-tabs-window v-model="tab">

          <!-- Cartes archivées -->
          <v-tabs-window-item value="cards">
            <div v-if="archiveStore.loading" class="pa-6 text-center">
              <v-progress-circular indeterminate color="primary" />
            </div>
            <div v-else-if="!archiveStore.archivedCards.length" class="pa-8 text-center">
              <v-icon icon="mdi-archive-off-outline" size="56" color="medium-emphasis" class="mb-3" />
              <p class="text-body-2 text-medium-emphasis">Aucune carte archivée</p>
            </div>
            <v-list v-else lines="two">
              <v-list-item
                v-for="card in archiveStore.archivedCards"
                :key="card.id"
                :title="card.title"
                :subtitle="card.archived_at ? 'Archivé le ' + formatDate(card.archived_at) : ''"
              >
                <template #prepend>
                  <v-avatar color="primary" variant="tonal" rounded="lg" size="36">
                    <v-icon icon="mdi-card-text-outline" size="18" />
                  </v-avatar>
                </template>
                <template #append>
                  <div class="d-flex gap-2">
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="primary"
                      :loading="restoringCardId === card.id"
                      @click="handleRestoreCard(card)"
                    >
                      Restaurer
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-tabs-window-item>

          <!-- Colonnes archivées -->
          <v-tabs-window-item value="columns">
            <div v-if="archiveStore.loading" class="pa-6 text-center">
              <v-progress-circular indeterminate color="primary" />
            </div>
            <div v-else-if="!archiveStore.archivedColumns.length" class="pa-8 text-center">
              <v-icon icon="mdi-archive-off-outline" size="56" color="medium-emphasis" class="mb-3" />
              <p class="text-body-2 text-medium-emphasis">Aucune colonne archivée</p>
            </div>
            <v-list v-else lines="two">
              <v-list-item
                v-for="col in archiveStore.archivedColumns"
                :key="col.id"
                :title="col.name"
                :subtitle="col.archived_at ? 'Archivé le ' + formatDate(col.archived_at) : ''"
              >
                <template #prepend>
                  <v-avatar color="secondary" variant="tonal" rounded="lg" size="36">
                    <v-icon icon="mdi-view-column-outline" size="18" />
                  </v-avatar>
                </template>
                <template #append>
                  <v-btn
                    size="small"
                    variant="tonal"
                    color="primary"
                    :loading="restoringColumnId === col.id"
                    @click="handleRestoreColumn(col)"
                  >
                    Restaurer
                  </v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useArchiveStore } from '@/stores/archive.store'
import { formatDate } from '@/utils/date'

const props = defineProps({
  boardId: { type: Number, required: true },
})

const model = defineModel({ type: Boolean, default: false })
const archiveStore = useArchiveStore()
const tab = ref('cards')

const restoringCardId   = ref(null)
const restoringColumnId = ref(null)

async function handleRestoreCard(card) {
  restoringCardId.value = card.id
  await archiveStore.restoreCard(props.boardId, card.id)
  restoringCardId.value = null
}

async function handleRestoreColumn(col) {
  restoringColumnId.value = col.id
  await archiveStore.restoreColumn(props.boardId, col.id)
  restoringColumnId.value = null
}
</script>
