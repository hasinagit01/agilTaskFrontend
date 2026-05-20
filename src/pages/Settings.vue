<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-6">Paramètres</h1>

      <v-row>
        <v-col cols="12" md="6">
          <!-- Apparence -->
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-2 font-weight-semibold">
              <v-icon icon="mdi-palette-outline" class="mr-2" />
              Apparence
            </v-card-title>
            <v-card-text class="px-5 pb-5">
              <v-switch
                v-model="darkMode"
                label="Mode sombre"
                color="primary"
                inset
                hide-details
              />
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <!-- Sécurité -->
          <v-card rounded="xl" elevation="0" border class="mb-4">
            <v-card-title class="pa-5 pb-2 font-weight-semibold">
              <v-icon icon="mdi-lock-outline" class="mr-2" />
              Sécurité
            </v-card-title>
            <v-card-text class="px-5 pb-5">
              <p class="text-body-2 text-medium-emphasis mb-4">
                Changez votre mot de passe pour sécuriser votre compte.
              </p>
              <v-btn
                variant="tonal"
                color="primary"
                prepend-icon="mdi-lock-reset"
                @click="passwordDialog = true"
              >
                Changer le mot de passe
              </v-btn>
            </v-card-text>
          </v-card>

          <!-- Danger zone -->
          <v-card rounded="xl" elevation="0" border color="error" variant="tonal">
            <v-card-title class="pa-5 pb-2 font-weight-semibold text-error">
              <v-icon icon="mdi-alert-outline" class="mr-2" />
              Zone dangereuse
            </v-card-title>
            <v-card-text class="px-5 pb-5">
              <p class="text-body-2 mb-4">
                La suppression de votre compte est irréversible. Toutes vos données seront perdues.
              </p>
              <v-btn
                variant="tonal"
                color="error"
                prepend-icon="mdi-delete-outline"
                @click="deleteDialog = true"
              >
                Supprimer mon compte
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Dialog changement de mot de passe -->
    <BaseModal
      v-model="passwordDialog"
      title="Changer le mot de passe"
      confirm-text="Enregistrer"
      @confirm="handlePasswordChange"
      :loading="savingPassword"
    >
      <v-text-field
        v-model="currentPassword"
        label="Mot de passe actuel"
        :type="showCurrent ? 'text' : 'password'"
        :append-inner-icon="showCurrent ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showCurrent = !showCurrent"
        variant="outlined"
        autofocus
        class="mb-3"
        hide-details
      />
      <v-text-field
        v-model="newPassword"
        label="Nouveau mot de passe"
        :type="showNew ? 'text' : 'password'"
        :append-inner-icon="showNew ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showNew = !showNew"
        variant="outlined"
        :rules="[v => v.length >= 8 || 'Minimum 8 caractères']"
        hide-details
      />
    </BaseModal>

    <!-- Dialog suppression de compte -->
    <BaseModal
      v-model="deleteDialog"
      title="Supprimer mon compte"
      confirm-text="Supprimer définitivement"
      confirm-color="error"
      @confirm="handleDeleteAccount"
      :loading="savingDelete"
    >
      <v-alert type="error" variant="tonal" class="mb-4" density="compact">
        Cette action est irréversible. Toutes vos données seront supprimées.
      </v-alert>
      <v-text-field
        v-model="deletePassword"
        label="Confirmez avec votre mot de passe"
        :type="showDelete ? 'text' : 'password'"
        :append-inner-icon="showDelete ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append-inner="showDelete = !showDelete"
        variant="outlined"
        autofocus
        hide-details
      />
    </BaseModal>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { userService } from '@/services/user.service'
import { useRouter } from 'vue-router'

const { isDark, setTheme } = useTheme()
const authStore = useAuthStore()
const notifStore = useNotificationStore()
const router = useRouter()

const darkMode = computed({
  get: () => isDark.value,
  set: (val) => setTheme(val ? 'dark' : 'light'),
})

// Password change
const passwordDialog = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const showCurrent = ref(false)
const showNew = ref(false)
const savingPassword = ref(false)

async function handlePasswordChange() {
  if (!currentPassword.value || newPassword.value.length < 8) return
  savingPassword.value = true
  try {
    await userService.updatePassword(currentPassword.value, newPassword.value)
    notifStore.success('Mot de passe mis à jour avec succès.')
    passwordDialog.value = false
    currentPassword.value = ''
    newPassword.value = ''
  } catch (err) {
    notifStore.error(err.message || 'Mot de passe actuel incorrect.')
  } finally {
    savingPassword.value = false
  }
}

// Account deletion
const deleteDialog = ref(false)
const deletePassword = ref('')
const showDelete = ref(false)
const savingDelete = ref(false)

async function handleDeleteAccount() {
  if (!deletePassword.value) return
  savingDelete.value = true
  try {
    await userService.deleteAccount(deletePassword.value)
    authStore.clearAuth()
    router.push('/login')
  } catch (err) {
    notifStore.error(err.message || 'Mot de passe incorrect.')
    savingDelete.value = false
  }
}
</script>
