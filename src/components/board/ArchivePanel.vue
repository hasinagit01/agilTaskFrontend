<template>
  <v-dialog v-model="model" max-width="700" scrollable>
    <v-card rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5">
        <span class="text-h6 font-weight-semibold">
          <v-icon icon="mdi-archive-outline" color="primary" class="mr-2" />
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

      <v-card-text class="pa-0 archive-content">
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
                      prepend-icon="mdi-restore"
                      :loading="restoringCardId === card.id"
                      @click="handleRestoreCard(card)"
                    >
                      Restaurer
                    </v-btn>
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="error"
                      prepend-icon="mdi-delete-outline"
                      :loading="deletingCardId === card.id"
                      @click="askDelete('card', card)"
                    >
                      Supprimer
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
                  <div class="d-flex gap-2">
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="primary"
                      prepend-icon="mdi-restore"
                      :loading="restoringColumnId === col.id"
                      @click="handleRestoreColumn(col)"
                    >
                      Restaurer
                    </v-btn>
                    <v-btn
                      size="small"
                      variant="tonal"
                      color="error"
                      prepend-icon="mdi-delete-outline"
                      :loading="deletingColumnId === col.id"
                      @click="askDelete('column', col)"
                    >
                      Supprimer
                    </v-btn>
                  </div>
                </template>
              </v-list-item>
            </v-list>
          </v-tabs-window-item>

        </v-tabs-window>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="confirmDialog" max-width="420" persistent>
    <v-card rounded="xl">
      <v-card-title class="pa-5 pb-2 font-weight-semibold text-error">
        <v-icon icon="mdi-alert-outline" color="error" class="mr-2" />
        Suppression définitive
      </v-card-title>
      <v-card-text class="pa-5 pt-2">
        Supprimer <strong>{{ pendingDelete?.item?.title ?? pendingDelete?.item?.name }}</strong> définitivement ?
        Cette action est irréversible.
      </v-card-text>
      <v-card-actions class="pa-4 gap-2">
        <v-spacer />
        <v-btn variant="text" prepend-icon="mdi-close" @click="confirmDialog = false">Annuler</v-btn>
        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-delete-forever"
          :loading="deletingCardId !== null || deletingColumnId !== null"
          @click="confirmDelete"
        >
          Supprimer définitivement
        </v-btn>
      </v-card-actions>
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
const deletingCardId    = ref(null)
const deletingColumnId  = ref(null)

const confirmDialog  = ref(false)
const pendingDelete  = ref(null) // { type: 'card'|'column', item }

function askDelete(type, item) {
  pendingDelete.value = { type, item }
  confirmDialog.value = true
}

async function confirmDelete() {
  const { type, item } = pendingDelete.value
  if (type === 'card') {
    deletingCardId.value = item.id
    await archiveStore.deleteArchivedCard(props.boardId, item)
    deletingCardId.value = null
  } else {
    deletingColumnId.value = item.id
    await archiveStore.deleteArchivedColumn(props.boardId, item.id)
    deletingColumnId.value = null
  }
  confirmDialog.value = false
  pendingDelete.value = null
}

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

<style scoped>
.archive-content {
  min-height: 300px;
}
</style>
