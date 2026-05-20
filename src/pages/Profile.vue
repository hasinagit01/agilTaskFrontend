<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-6">Mon profil</h1>

      <v-row>
        <!-- Carte profil -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" border class="text-center pa-4">
            <v-avatar color="primary" size="96" class="mb-4">
              <span class="text-h4 text-white font-weight-bold">
                {{ authStore.userInitials }}
              </span>
            </v-avatar>
            <div class="text-h6 font-weight-bold mb-1">
              {{ fullName || authStore.currentUser?.email }}
            </div>
            <div class="text-caption text-medium-emphasis mb-1">
              {{ authStore.currentUser?.email }}
            </div>
            <div class="text-caption text-medium-emphasis mb-4">
              Membre depuis le {{ joinDate }}
            </div>
            <v-chip color="primary" variant="tonal" size="small">
              Utilisateur
            </v-chip>
          </v-card>
        </v-col>

        <!-- Informations du compte -->
        <v-col cols="12" md="8">
          <v-card rounded="xl" elevation="0" border class="mb-4">
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Informations personnelles
            </v-card-title>
            <v-card-text class="pa-5">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editFirstname"
                    label="Prénom"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editName"
                    label="Nom"
                    variant="outlined"
                    density="compact"
                    hide-details
                  />
                </v-col>
              </v-row>
              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="primary"
                  variant="flat"
                  :loading="savingProfile"
                  @click="handleProfileUpdate"
                >
                  Enregistrer
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Adresse email
            </v-card-title>
            <v-card-text class="pa-5">
              <v-list class="pa-0">
                <v-list-item
                  prepend-icon="mdi-identifier"
                  title="Identifiant"
                  :subtitle="String(authStore.currentUser?.id)"
                  class="px-0"
                />
                <v-divider class="my-2" />
                <v-list-item
                  prepend-icon="mdi-email-outline"
                  title="Email"
                  :subtitle="authStore.currentUser?.email"
                  class="px-0"
                />
              </v-list>
              <v-btn
                class="mt-4"
                variant="tonal"
                color="primary"
                prepend-icon="mdi-pencil-outline"
                @click="openEmailDialog"
              >
                Modifier l'email
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Dialog modification email -->
    <BaseModal
      v-model="emailDialog"
      title="Modifier l'email"
      confirm-text="Enregistrer"
      @confirm="handleEmailUpdate"
      :loading="savingEmail"
    >
      <v-text-field
        v-model="newEmail"
        label="Nouvel email"
        type="email"
        variant="outlined"
        autofocus
        :rules="[v => !!v || 'Requis', v => /.+@.+\..+/.test(v) || 'Email invalide']"
        @keyup.enter="handleEmailUpdate"
      />
    </BaseModal>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { userService } from '@/services/user.service'

const authStore  = useAuthStore()
const notifStore = useNotificationStore()

const editFirstname = ref(authStore.currentUser?.firstname ?? '')
const editName      = ref(authStore.currentUser?.name ?? '')
const savingProfile = ref(false)

const emailDialog = ref(false)
const newEmail    = ref('')
const savingEmail = ref(false)

const fullName = computed(() => {
  const u = authStore.currentUser
  if (u?.firstname || u?.name) return [u.firstname, u.name].filter(Boolean).join(' ')
  return ''
})

const joinDate = computed(() => {
  const d = authStore.currentUser?.created_at
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
})

onMounted(() => {
  editFirstname.value = authStore.currentUser?.firstname ?? ''
  editName.value      = authStore.currentUser?.name ?? ''
})

async function handleProfileUpdate() {
  savingProfile.value = true
  try {
    const result = await userService.updateProfile(
      editFirstname.value.trim() || null,
      editName.value.trim() || null,
    )
    authStore.updateUser({ firstname: result.data.firstname, name: result.data.name })
    notifStore.success('Profil mis à jour avec succès.')
  } catch (err) {
    notifStore.error(err.message || 'Erreur lors de la mise à jour.')
  } finally {
    savingProfile.value = false
  }
}

function openEmailDialog() {
  newEmail.value = authStore.currentUser?.email ?? ''
  emailDialog.value = true
}

async function handleEmailUpdate() {
  if (!newEmail.value || !/.+@.+\..+/.test(newEmail.value)) return
  savingEmail.value = true
  try {
    const result = await userService.updateEmail(newEmail.value.trim())
    authStore.updateUser({ email: result.data.email })
    notifStore.success('Email mis à jour avec succès.')
    emailDialog.value = false
  } catch (err) {
    notifStore.error(err.message || 'Erreur lors de la mise à jour.')
  } finally {
    savingEmail.value = false
  }
}
</script>
