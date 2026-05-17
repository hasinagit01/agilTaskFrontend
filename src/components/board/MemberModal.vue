<template>
  <v-dialog v-model="model" max-width="540" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-semibold">Membres du board</span>
        <v-btn icon="mdi-close" variant="text" density="compact" @click="model = false" />
      </v-card-title>
      <v-divider />

      <v-card-text class="pa-5">
        <!-- Recherche (owner uniquement) -->
        <template v-if="isOwner">
          <p class="text-body-2 font-weight-medium mb-2">Ajouter un membre</p>
          <div class="d-flex gap-2 mb-1">
            <v-text-field
              v-model="searchQuery"
              placeholder="Rechercher par email..."
              hide-details
              prepend-inner-icon="mdi-magnify"
              clearable
              @input="onSearchInput"
              @click:clear="clearSearch"
            />
          </div>

          <!-- Résultats de recherche -->
          <v-list v-if="filteredResults.length" class="mb-4 border">
            <v-list-item
              v-for="u in filteredResults"
              :key="u.id"
              :title="u.email"
            >
              <template #prepend>
                <v-avatar color="primary" size="32">
                  <span class="text-caption text-white">{{ u.email?.[0]?.toUpperCase() ?? '?' }}</span>
                </v-avatar>
              </template>
              <template #append>
                <v-btn
                  size="small"
                  color="primary"
                  variant="tonal"
                  :loading="addingId === u.id"
                  :disabled="isAlreadyMember(u.id)"
                  @click="addMember(u)"
                >
                  {{ isAlreadyMember(u.id) ? 'Déjà membre' : 'Ajouter' }}
                </v-btn>
              </template>
            </v-list-item>
          </v-list>

          <p v-if="searched && !filteredResults.length && !searching" class="text-caption text-medium-emphasis mb-4">
            Aucun utilisateur trouvé pour "{{ searchQuery }}"
          </p>
        </template>

        <v-divider class="mb-4" />

        <!-- Membres actuels -->
        <p class="text-body-2 font-weight-medium mb-2">
          Membres actuels
          <v-chip size="x-small" class="ml-1">{{ memberStore.members.length }}</v-chip>
        </p>

        <div v-if="memberStore.loading" class="d-flex justify-center py-4">
          <v-progress-circular indeterminate size="24" />
        </div>

        <v-list v-else>
          <v-list-item
            v-for="m in memberStore.members"
            :key="m.user_id"
            :title="m.email"
            class="mb-1"
          >
            <template #prepend>
              <v-avatar color="primary" size="32">
                <span class="text-caption text-white">{{ m.email?.[0]?.toUpperCase() ?? '?' }}</span>
              </v-avatar>
            </template>
            <template #append>
              <div class="member-actions">
                <!-- Rôle non modifiable : owner ou utilisateur non propriétaire -->
                <v-chip
                  v-if="m.role === 'owner' || !isOwner"
                  size="x-small"
                  :color="roleColor(m.role)"
                  variant="tonal"
                >
                  {{ roleLabel(m.role) }}
                </v-chip>

                <!-- Sélecteur de rôle pour les membres modifiables -->
                <v-select
                  v-else
                  :model-value="m.role"
                  :items="roleOptions"
                  item-title="label"
                  item-value="value"
                  density="compact"
                  hide-details
                  variant="outlined"
                  class="role-select"
                  :loading="updatingRoleId === m.user_id"
                  @update:model-value="handleRoleChange(m, $event)"
                />

                <v-btn
                  v-if="isOwner && m.user_id !== currentUserId"
                  icon="mdi-close"
                  variant="text"
                  size="x-small"
                  color="error"
                  :loading="removingId === m.user_id"
                  @click="removeMember(m)"
                />
              </div>
            </template>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { userService }   from '@/services/user.service'
import { useMemberStore } from '@/stores/member.store'
import { useAuthStore }   from '@/stores/auth.store'

const model = defineModel({ type: Boolean, default: false })

watch(model, (open) => { if (!open) clearSearch() })

const props = defineProps({
  boardId: { type: Number, required: true },
})

const memberStore   = useMemberStore()
const authStore     = useAuthStore()
const currentUserId = computed(() => authStore.currentUser?.id)
const isOwner       = computed(() =>
  memberStore.members.some(m => m.user_id === currentUserId.value && m.role === 'owner')
)

const roleOptions = [
  { label: 'Membre',  value: 'member'  },
  { label: 'Lecteur', value: 'viewer'  },
]

function roleLabel(role) {
  const map = { owner: 'Propriétaire', member: 'Membre', viewer: 'Lecteur' }
  return map[role] ?? role
}

function roleColor(role) {
  return role === 'owner' ? 'primary' : role === 'viewer' ? 'secondary' : 'success'
}

// Recherche
const searchQuery   = ref('')
const searchResults = ref([])
const searching     = ref(false)
const searched      = ref(false)
let searchTimeout   = null

// Exclure l'utilisateur courant et les membres existants sans résultat "Déjà membre"
const filteredResults = computed(() =>
  searchResults.value.filter(u => u.id !== currentUserId.value)
)

function onSearchInput() {
  clearTimeout(searchTimeout)
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    searched.value = false
    return
  }
  searchTimeout = setTimeout(doSearch, 350)
}

async function doSearch() {
  searching.value = true
  searched.value  = true
  try {
    const result = await userService.search(searchQuery.value)
    searchResults.value = result.data
  } catch {
    searchResults.value = []
  } finally {
    searching.value = false
  }
}

function clearSearch() {
  searchQuery.value   = ''
  searchResults.value = []
  searched.value      = false
}

function isAlreadyMember(userId) {
  return memberStore.members.some(m => m.user_id === userId)
}

// Ajout
const addingId = ref(null)

async function addMember(user) {
  addingId.value = user.id
  await memberStore.addMember(props.boardId, { user_id: user.id, role: 'member' })
  addingId.value = null
  searchResults.value = searchResults.value.filter(u => u.id !== user.id)
}

// Changement de rôle
const updatingRoleId = ref(null)

async function handleRoleChange(member, newRole) {
  if (!newRole || newRole === member.role) return
  updatingRoleId.value = member.user_id
  await memberStore.updateMemberRole(props.boardId, member.user_id, newRole)
  updatingRoleId.value = null
}

// Suppression
const removingId = ref(null)

async function removeMember(member) {
  removingId.value = member.user_id
  await memberStore.removeMember(props.boardId, member.user_id)
  removingId.value = null
}
</script>

<style scoped>
.member-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.role-select {
  width: 120px;
}
</style>
