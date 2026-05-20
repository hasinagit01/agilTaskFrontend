<template>
  <DefaultLayout>
    <div>
      <!-- En-tête -->
      <div class="d-flex align-center justify-space-between mb-6 flex-wrap gap-3">
        <div>
          <h1 class="text-h4 font-weight-bold page-title">Mes boards</h1>
          <p class="text-medium-emphasis mt-1">
            Bienvenue, {{ authStore.currentUser?.email }}
          </p>
        </div>
        <div class="d-flex align-center gap-3 flex-wrap">
          <v-text-field
            v-model="search"
            placeholder="Rechercher un board..."
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
            density="compact"
            style="min-width: 220px; margin-right: 16px"
          />
          <BaseButton prepend-icon="mdi-plus" @click="openCreateDialog">
            Nouveau board
          </BaseButton>
        </div>
      </div>

      <!-- Loader initial (aucun board chargé) -->
      <SkeletonBoardGrid v-if="boardStore.loading && !boardStore.boards.length" :count="4" />

      <!-- Grille de boards -->
      <v-row v-if="boardStore.boards.length">
        <v-col
          v-for="board in filteredBoards"
          :key="board.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card
            rounded="xl"
            elevation="0"
            border
            class="board-card"
            :to="`/boards/${board.id}`"
          >
            <v-card-text class="pa-5">
              <div class="d-flex align-start justify-space-between">
                <div class="flex-grow-1 mr-2">
                  <v-avatar color="primary" size="40" rounded="lg" class="mb-3">
                    <v-icon icon="mdi-view-kanban" size="22" color="white" />
                  </v-avatar>
                  <h3 class="text-body-1 font-weight-semibold mb-1">{{ board.name }}</h3>
                  <p class="text-caption text-medium-emphasis">
                    Créé le {{ formatDate(board.created_at) }}
                  </p>
                </div>
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      variant="text"
                      size="small"
                      v-bind="props"
                      @click.prevent
                    />
                  </template>
                  <v-list>
                    <v-list-item
                      prepend-icon="mdi-pencil-outline"
                      title="Renommer"
                      @click="openRenameDialog(board)"
                    />
                    <v-list-item
                      prepend-icon="mdi-delete-outline"
                      title="Supprimer"
                      class="text-error"
                      @click="openDeleteDialog(board)"
                    />
                  </v-list>
                </v-menu>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Charger plus -->
      <div v-if="boardStore.boards.length && boardStore.hasMore" class="text-center mt-6">
        <v-btn
          variant="tonal"
          :loading="boardStore.loading"
          @click="boardStore.loadMore()"
        >
          Charger plus
        </v-btn>
        <p class="text-caption text-medium-emphasis mt-2">
          {{ boardStore.boards.length }} / {{ boardStore.total }} boards
        </p>
      </div>

      <!-- État vide -->
      <div v-else-if="!boardStore.loading && !boardStore.boards.length" class="text-center py-16">
        <v-icon icon="mdi-view-kanban-outline" size="72" color="medium-emphasis" class="mb-4" />
        <h3 class="text-h6 text-medium-emphasis mb-2">Aucun board pour l'instant</h3>
        <p class="text-body-2 text-medium-emphasis mb-6">
          Créez votre premier board pour commencer à organiser vos tâches.
        </p>
        <BaseButton prepend-icon="mdi-plus" @click="openCreateDialog">
          Créer un board
        </BaseButton>
      </div>
    </div>

    <!-- Dialog création -->
    <BaseModal v-model="createDialog" title="Nouveau board" @confirm="handleCreate" :loading="saving">
      <v-text-field
        v-model="boardName"
        label="Nom du board"
        variant="outlined"
        autofocus
        :rules="[v => !!v || 'Requis', v => v.length >= 2 || 'Minimum 2 caractères']"
        @keyup.enter="handleCreate"
      />
    </BaseModal>

    <!-- Dialog renommage -->
    <BaseModal v-model="renameDialog" title="Renommer le board" @confirm="handleRename" :loading="saving">
      <v-text-field
        v-model="boardName"
        label="Nouveau nom"
        variant="outlined"
        autofocus
        :rules="[v => !!v || 'Requis', v => v.length >= 2 || 'Minimum 2 caractères']"
        @keyup.enter="handleRename"
      />
    </BaseModal>

    <!-- Dialog suppression -->
    <BaseModal
      v-model="deleteDialog"
      title="Supprimer le board"
      confirm-text="Supprimer"
      confirm-color="error"
      @confirm="handleDelete"
      :loading="saving"
    >
      <p>Êtes-vous sûr de vouloir supprimer <strong>{{ selectedBoard?.name }}</strong> ?<br>
      Cette action est irréversible.</p>
    </BaseModal>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout    from '@/layouts/DefaultLayout.vue'
import BaseButton       from '@/components/common/BaseButton.vue'
import BaseModal        from '@/components/common/BaseModal.vue'
import SkeletonBoardGrid from '@/components/common/SkeletonBoardGrid.vue'
import { useAuthStore }  from '@/stores/auth.store'
import { useBoardStore } from '@/stores/board.store'
import { formatDate } from '@/utils/date'

const authStore  = useAuthStore()
const boardStore = useBoardStore()

const search = ref('')
const filteredBoards = computed(() => {
  if (!search.value?.trim()) return boardStore.boards
  const q = search.value.toLowerCase()
  return boardStore.boards.filter(b => b.name.toLowerCase().includes(q))
})

const createDialog = ref(false)
const renameDialog = ref(false)
const deleteDialog = ref(false)
const boardName    = ref('')
const selectedBoard = ref(null)
const saving       = ref(false)

function openCreateDialog() {
  boardName.value = ''
  createDialog.value = true
}

function openRenameDialog(board) {
  selectedBoard.value = board
  boardName.value = board.name
  renameDialog.value = true
}

function openDeleteDialog(board) {
  selectedBoard.value = board
  deleteDialog.value = true
}

async function handleCreate() {
  if (!boardName.value || boardName.value.length < 2) return
  saving.value = true
  await boardStore.createBoard(boardName.value.trim())
  saving.value = false
  createDialog.value = false
}

async function handleRename() {
  if (!boardName.value || boardName.value.length < 2) return
  saving.value = true
  await boardStore.updateBoard(selectedBoard.value.id, boardName.value.trim())
  saving.value = false
  renameDialog.value = false
}

async function handleDelete() {
  saving.value = true
  await boardStore.removeBoard(selectedBoard.value.id)
  saving.value = false
  deleteDialog.value = false
}

onMounted(() => boardStore.fetchBoards())
</script>

<style scoped>
.board-card {
  transition: transform 0.15s, box-shadow 0.15s;
  cursor: pointer;
  text-decoration: none;
}
.board-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
}
</style>
