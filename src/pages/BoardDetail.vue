<template>
  <DefaultLayout>
    <div class="board-detail">
      <!-- En-tête -->
      <div class="d-flex align-center justify-space-between mb-4 flex-wrap gap-3">
        <div class="d-flex align-center gap-3">
          <v-btn
            icon="mdi-arrow-left"
            variant="text"
            size="small"
            :to="{ name: 'Home' }"
          />
          <div>
            <h1 class="text-h5 font-weight-bold page-title">{{ boardStore.currentBoard?.name }}</h1>
          </div>
        </div>
        <div class="header-actions">
          <div class="header-actions__group">
            <v-btn
              v-if="isOwner"
              variant="tonal"
              size="small"
              :icon="mobile ? 'mdi-account-group-outline' : undefined"
              :prepend-icon="mobile ? undefined : 'mdi-account-group-outline'"
              @click="memberModalOpen = true"
            >
              <span class="d-none d-sm-inline">Membres</span>
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              :icon="mobile ? 'mdi-label-outline' : undefined"
              :prepend-icon="mobile ? undefined : 'mdi-label-outline'"
              @click="labelModalOpen = true"
            >
              <span class="d-none d-sm-inline">Labels</span>
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              :icon="mobile ? 'mdi-archive-outline' : undefined"
              :prepend-icon="mobile ? undefined : 'mdi-archive-outline'"
              @click="archiveOpen = true"
            >
              <span class="d-none d-sm-inline">Archives</span>
            </v-btn>
            <v-btn
              variant="tonal"
              size="small"
              :icon="mobile ? 'mdi-history' : undefined"
              :prepend-icon="mobile ? undefined : 'mdi-history'"
              @click="activityOpen = true"
            >
              <span class="d-none d-sm-inline">Activité</span>
            </v-btn>
          </div>
          <v-divider vertical class="header-actions__divider" />
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            :icon="mobile ? 'mdi-plus' : undefined"
            :prepend-icon="mobile ? undefined : 'mdi-plus'"
            @click="openAddColumn"
          >
            <span class="d-none d-sm-inline">Ajouter une colonne</span>
          </v-btn>
        </div>
      </div>

      <!-- Barre de filtres -->
      <div v-if="!loading" class="d-flex align-center gap-4 mb-4 flex-wrap">
        <v-select
          v-model="filterLabelId"
          :items="labelStore.labels"
          item-title="name"
          item-value="id"
          placeholder="Filtrer par label"
          hide-details
          density="compact"
          clearable
          class="filter-select mr-4"
        >
          <template #item="{ item, props: p }">
            <v-list-item v-bind="p">
              <template #prepend>
                <v-chip :color="item.raw.color" size="x-small" variant="flat" label class="mr-2">&nbsp;</v-chip>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-select
          v-model="filterAssigneeId"
          :items="memberStore.members"
          item-title="email"
          item-value="user_id"
          placeholder="Filtrer par assigné"
          hide-details
          density="compact"
          clearable
          class="filter-select"
        >
          <template #item="{ item, props: p }">
            <v-list-item v-bind="p">
              <template #prepend>
                <UserAvatar :user="item.raw" :size="28" class="mr-2" />
              </template>
            </v-list-item>
          </template>
          <template #selection="{ item }">
            <div class="d-flex align-center gap-2">
              <UserAvatar :user="item.raw" :size="20" />
              <span class="text-body-2">{{ item.raw.email }}</span>
            </div>
          </template>
        </v-select>

        <v-chip
          v-if="isFiltered"
          size="small"
          variant="tonal"
          color="primary"
          closable
          @click:close="clearFilters"
        >
          Filtres actifs
        </v-chip>
      </div>

      <!-- Loader -->
      <SkeletonKanban v-if="loading" />

      <!-- Kanban -->
      <div v-else class="kanban-scroll">
        <div class="kanban-board">
          <KanbanColumn
            v-for="column in columnStore.columns"
            :key="column.id"
            :column="column"
            :cards="filteredCards(column.id)"
            :board-id="boardId"
            @add-card="handleAddCard"
            @rename="handleRenameColumn"
            @delete="confirmDeleteColumn"
            @open-card="openCardDetail"
            @drop-card="handleDropCard"
            @reorder-columns="handleReorderColumns"
            @reorder-cards="handleReorderCards"
            @archive-card="handleArchiveCard"
            @archive-column="handleArchiveColumn"
          />

          <!-- Fantôme d'ajout de colonne -->
          <div v-if="addingColumn" class="kanban-column-ghost">
            <v-text-field
              v-model="newColumnName"
              placeholder="Nom de la colonne..."
              variant="outlined"
              density="compact"
              hide-details
              autofocus
              class="mb-2"
              @keyup.enter="submitAddColumn"
              @keyup.esc="cancelAddColumn"
            />
            <div class="d-flex gap-2">
              <v-btn color="primary" size="small" variant="flat" prepend-icon="mdi-check" :loading="savingColumn" @click="submitAddColumn">
                Ajouter
              </v-btn>
              <v-btn variant="text" size="small" prepend-icon="mdi-close" @click="cancelAddColumn">Annuler</v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal suppression colonne -->
    <BaseModal
      v-model="deleteColumnDialog"
      title="Supprimer la colonne"
      confirm-text="Supprimer"
      confirm-icon="mdi-delete-outline"
      confirm-color="error"
      :loading="deletingColumn"
      @confirm="handleDeleteColumn"
    >
      <p>Supprimer <strong>{{ columnToDelete?.name }}</strong> et toutes ses cartes ?<br>
      Cette action est irréversible.</p>
    </BaseModal>

    <!-- Modal détail carte -->
    <CardDetailModal
      v-model="cardDetailOpen"
      :card="selectedCard"
      :saving="savingCard"
      :deleting="deletingCard"
      @save="handleSaveCard"
      @delete="confirmDeleteCard"
      @detach-label="handleDetachLabel"
      @unassign="handleUnassign"
      @assign="handleAssign"
      @attach-label="handleAttachLabel"
    />

    <!-- Modal suppression carte -->
    <BaseModal
      v-model="deleteCardDialog"
      title="Supprimer la carte"
      confirm-text="Supprimer"
      confirm-icon="mdi-delete-outline"
      confirm-color="error"
      :loading="deletingCard"
      @confirm="handleDeleteCard"
    >
      <p>Supprimer la carte <strong>{{ cardToDelete?.title }}</strong> ?</p>
    </BaseModal>

    <!-- Modal membres -->
    <MemberModal
      v-model="memberModalOpen"
      :board-id="boardId"
    />

    <!-- Modal labels -->
    <LabelModal
      v-model="labelModalOpen"
      :board-id="boardId"
    />

    <!-- Panneau archives -->
    <ArchivePanel v-model="archiveOpen" :board-id="boardId" />

    <!-- Tiroir activité -->
    <ActivityDrawer v-model="activityOpen" :board-id="boardId" />

    <!-- Confirmation quitter sans sauvegarder -->
    <BaseModal
      v-model="leaveConfirmOpen"
      title="Modifications non sauvegardées"
      confirm-text="Quitter"
      confirm-icon="mdi-exit-to-app"
      confirm-color="error"
      @confirm="handleLeaveConfirm"
      @update:model-value="handleLeaveCancel"
    >
      <p>Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter cette page ?</p>
    </BaseModal>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import DefaultLayout   from '@/layouts/DefaultLayout.vue'
import BaseModal       from '@/components/common/BaseModal.vue'
import SkeletonKanban  from '@/components/common/SkeletonKanban.vue'
import KanbanColumn    from '@/components/board/KanbanColumn.vue'
import CardDetailModal from '@/components/board/CardDetailModal.vue'
import MemberModal     from '@/components/board/MemberModal.vue'
import LabelModal      from '@/components/board/LabelModal.vue'
import ArchivePanel    from '@/components/board/ArchivePanel.vue'
import ActivityDrawer  from '@/components/board/ActivityDrawer.vue'
import UserAvatar      from '@/components/common/UserAvatar.vue'
import { useBoardStore  } from '@/stores/board.store'
import { useColumnStore } from '@/stores/column.store'
import { useCardStore   } from '@/stores/card.store'
import { useLabelStore  } from '@/stores/label.store'
import { useMemberStore } from '@/stores/member.store'
import { useAuthStore   } from '@/stores/auth.store'
import { useArchiveStore }   from '@/stores/archive.store'
import { useActivityStore }  from '@/stores/activity.store'
import { labelService   } from '@/services/label.service'
import { assigneeService } from '@/services/assignee.service'

const { mobile } = useDisplay()
const route   = useRoute()
const router  = useRouter()
const boardId = computed(() => parseInt(route.params.id))

const boardStore  = useBoardStore()
const columnStore = useColumnStore()
const cardStore   = useCardStore()
const labelStore  = useLabelStore()
const memberStore = useMemberStore()
const authStore   = useAuthStore()

const isOwner = computed(() =>
  memberStore.members.some(
    m => m.user_id === authStore.currentUser?.id && m.role === 'owner'
  )
)

const filterLabelId    = ref(null)
const filterAssigneeId = ref(null)
const isFiltered = computed(() => filterLabelId.value || filterAssigneeId.value)

function clearFilters() {
  filterLabelId.value    = null
  filterAssigneeId.value = null
}

function filteredCards(columnId) {
  let cards = cardStore.cardsByColumn[columnId] || []
  if (filterLabelId.value) {
    cards = cards.filter(c => c.labels?.some(l => l.id === filterLabelId.value))
  }
  if (filterAssigneeId.value) {
    cards = cards.filter(c => c.assignees?.some(a => a.user_id === filterAssigneeId.value))
  }
  return cards
}

const archiveStore  = useArchiveStore()
const activityStore = useActivityStore()
const archiveOpen   = ref(false)
const activityOpen  = ref(false)

const loading         = ref(false)
const memberModalOpen = ref(false)
const labelModalOpen  = ref(false)

// ===== Guard de navigation =====
const leaveConfirmOpen = ref(false)
let   pendingRoute     = null
let   leaveApproved    = false

const hasUnsavedChanges = computed(() =>
  addingColumn.value && newColumnName.value.trim().length > 0
)

onBeforeRouteLeave((to) => {
  if (!leaveApproved && hasUnsavedChanges.value) {
    pendingRoute = to
    leaveConfirmOpen.value = true
    return false
  }
})

async function handleLeaveConfirm() {
  leaveApproved = true
  leaveConfirmOpen.value = false
  await router.push(pendingRoute)
  leaveApproved = false
  pendingRoute  = null
}

function handleLeaveCancel() {
  leaveConfirmOpen.value = false
  pendingRoute = null
}

// ===== Ajout colonne =====
const addingColumn   = ref(false)
const newColumnName  = ref('')
const savingColumn   = ref(false)

function openAddColumn() { addingColumn.value = true }
function cancelAddColumn() { newColumnName.value = ''; addingColumn.value = false }

async function submitAddColumn() {
  if (!newColumnName.value.trim()) return
  savingColumn.value = true
  await columnStore.createColumn(boardId.value, newColumnName.value.trim())
  savingColumn.value = false
  cancelAddColumn()
}

// ===== Suppression colonne =====
const deleteColumnDialog = ref(false)
const columnToDelete     = ref(null)
const deletingColumn     = ref(false)

function confirmDeleteColumn(column) { columnToDelete.value = column; deleteColumnDialog.value = true }

async function handleDeleteColumn() {
  deletingColumn.value = true
  await columnStore.removeColumn(boardId.value, columnToDelete.value.id)
  deletingColumn.value = false
  deleteColumnDialog.value = false
}

// ===== Renommage colonne =====
async function handleRenameColumn({ columnId, name }) {
  await columnStore.updateColumn(boardId.value, columnId, { name })
}

// ===== Ajout carte =====
async function handleAddCard({ columnId, title }) {
  await cardStore.createCard(boardId.value, columnId, { title })
}

// ===== Drag & Drop carte =====
async function handleDropCard({ cardId, fromColumnId, toColumnId }) {
  await cardStore.moveCard(boardId.value, fromColumnId, cardId, toColumnId)
}

async function handleReorderColumns({ fromColumnId, toColumnId, side }) {
  const cols = [...columnStore.columns]
  const fromIdx = cols.findIndex(c => c.id === fromColumnId)
  const toIdx   = cols.findIndex(c => c.id === toColumnId)
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return

  const [moved] = cols.splice(fromIdx, 1)
  // After removal, indices after fromIdx shift left by 1
  const adjustedTo = toIdx > fromIdx ? toIdx - 1 : toIdx
  const insertAt   = side === 'right' ? adjustedTo + 1 : adjustedTo
  cols.splice(insertAt, 0, moved)
  await columnStore.reorderColumns(boardId.value, cols.map(c => c.id))
}

async function handleReorderCards({ columnId, cardIds }) {
  await cardStore.reorderCards(boardId.value, columnId, cardIds)
}

// ===== Détail carte =====
const cardDetailOpen = ref(false)
const selectedCard   = ref(null)
const savingCard     = ref(false)
const deleteCardDialog = ref(false)
const cardToDelete   = ref(null)
const deletingCard   = ref(false)

function openCardDetail(card) {
  selectedCard.value = card
  cardDetailOpen.value = true
}

async function handleSaveCard({ card, data }) {
  savingCard.value = true
  await cardStore.updateCard(boardId.value, card.column_id, card.id, data)
  savingCard.value = false
  cardDetailOpen.value = false
}

function confirmDeleteCard(card) {
  cardToDelete.value = card
  deleteCardDialog.value = true
}

async function handleDeleteCard() {
  deletingCard.value = true
  await cardStore.removeCard(boardId.value, cardToDelete.value.column_id, cardToDelete.value.id)
  deletingCard.value = false
  deleteCardDialog.value = false
  cardDetailOpen.value = false
}

// ===== Labels & Assignees =====
function refreshSelectedCard(columnId, cardId) {
  const updated = (cardStore.cardsByColumn[columnId] || []).find(c => c.id === cardId)
  if (updated) selectedCard.value = updated
}

async function handleDetachLabel({ card, labelId }) {
  await labelService.detach(boardId.value, card.column_id, card.id, labelId)
  await cardStore.fetchCards(boardId.value, card.column_id)
  refreshSelectedCard(card.column_id, card.id)
}

async function handleUnassign({ card, userId }) {
  await assigneeService.unassign(boardId.value, card.column_id, card.id, userId)
  await cardStore.fetchCards(boardId.value, card.column_id)
  refreshSelectedCard(card.column_id, card.id)
}

async function handleAssign({ card, userId }) {
  await assigneeService.assign(boardId.value, card.column_id, card.id, userId)
  await cardStore.fetchCards(boardId.value, card.column_id)
  refreshSelectedCard(card.column_id, card.id)
}

async function handleAttachLabel({ card, labelId }) {
  await labelService.attach(boardId.value, card.column_id, card.id, labelId)
  await cardStore.fetchCards(boardId.value, card.column_id)
  refreshSelectedCard(card.column_id, card.id)
}

// ===== Archivage =====
async function handleArchiveCard({ boardId: bid, columnId, cardId }) {
  await archiveStore.archiveCard(bid, columnId, cardId)
}

async function handleArchiveColumn({ boardId: bid, columnId }) {
  await archiveStore.archiveColumn(bid, columnId)
}

// ===== Chargement initial =====
async function loadBoard() {
  loading.value = true
  await boardStore.fetchBoard(boardId.value)
  await Promise.all([
    columnStore.fetchColumns(boardId.value),
    memberStore.fetchMembers(boardId.value),
    labelStore.fetchLabels(boardId.value),
  ])
  await Promise.all(
    columnStore.columns.map(col => cardStore.fetchCards(boardId.value, col.id))
  )
  archiveStore.fetchArchives(boardId.value)
  loading.value = false
}

watch(
  () => boardStore.currentBoard?.name,
  (name) => { if (name) document.title = `${name} · Agil Task` },
)

onMounted(loadBoard)

onUnmounted(() => {
  columnStore.reset()
  cardStore.reset()
  labelStore.reset()
  memberStore.reset()
  archiveStore.reset()
  activityStore.reset()
})
</script>

<style scoped>
.filter-select {
  max-width: 200px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-actions__group {
  display: flex;
  gap: 8px;
}
.header-actions__divider {
  height: 24px;
  align-self: center;
}
.board-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.kanban-scroll {
  overflow-x: auto;
  padding-bottom: 16px;
  flex: 1;
}
.kanban-board {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-height: 200px;
}
.kanban-column-ghost {
  background: rgba(var(--v-theme-surface-variant), 0.4);
  border-radius: 12px;
  padding: 12px;
  min-width: 280px;
  width: 280px;
  flex-shrink: 0;
}

@media (max-width: 600px) {
  .kanban-scroll {
    overflow-x: hidden;
  }
  .kanban-board {
    flex-direction: column;
    align-items: stretch;
  }
  .kanban-column-ghost {
    width: 100%;
    min-width: unset;
  }
}
</style>
