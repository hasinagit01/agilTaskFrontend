<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-6">Paramètres</h1>

      <v-row>
        <v-col cols="12" md="6">
          <!-- Apparence -->
          <v-card rounded="xl" elevation="0" border class="mb-4">
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
              />
              <v-divider class="my-3" />
              <div class="text-body-2 mb-2 font-weight-medium">Couleur principale</div>
              <div class="d-flex gap-2 flex-wrap">
                <v-btn
                  v-for="c in colorOptions"
                  :key="c.value"
                  :color="c.value"
                  icon
                  size="small"
                  :variant="selectedColor === c.value ? 'elevated' : 'tonal'"
                  @click="selectedColor = c.value"
                />
              </div>
            </v-card-text>
          </v-card>

          <!-- Notifications -->
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-2 font-weight-semibold">
              <v-icon icon="mdi-bell-outline" class="mr-2" />
              Notifications
            </v-card-title>
            <v-card-text class="px-5 pb-5">
              <v-switch
                v-for="notif in notifSettings"
                :key="notif.key"
                v-model="notif.enabled"
                :label="notif.label"
                color="primary"
                inset
                density="compact"
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
              <v-form ref="passwordForm" @submit.prevent="changePassword">
                <BaseInput
                  v-model="passwords.current"
                  label="Mot de passe actuel"
                  type="password"
                  :rules="[rules.required]"
                  class="mb-2"
                />
                <BaseInput
                  v-model="passwords.new"
                  label="Nouveau mot de passe"
                  type="password"
                  :rules="[rules.required, rules.password]"
                  class="mb-2"
                />
                <BaseInput
                  v-model="passwords.confirm"
                  label="Confirmer le nouveau mot de passe"
                  type="password"
                  :rules="[rules.required, rules.confirmPassword(passwords.new)]"
                  class="mb-4"
                />
                <BaseButton type="submit" :loading="changingPwd" block prepend-icon="mdi-lock-reset">
                  Changer le mot de passe
                </BaseButton>
              </v-form>
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
                La suppression de votre compte est irréversible. Toutes vos données seront effacées.
              </p>
              <v-btn color="error" variant="outlined" prepend-icon="mdi-delete-outline" @click="deleteDialog = true">
                Supprimer mon compte
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Dialog confirmation suppression -->
      <BaseModal v-model="deleteDialog" title="Confirmer la suppression" max-width="420" persistent>
        <p>Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.</p>
        <template #actions>
          <v-spacer />
          <BaseButton variant="tonal" color="secondary" @click="deleteDialog = false">Annuler</BaseButton>
          <BaseButton color="error" prepend-icon="mdi-delete" @click="handleDeleteAccount">Supprimer</BaseButton>
        </template>
      </BaseModal>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseInput     from '@/components/common/BaseInput.vue'
import BaseButton    from '@/components/common/BaseButton.vue'
import BaseModal     from '@/components/common/BaseModal.vue'
import { useTheme }  from '@/composables/useTheme'
import { useAuth }   from '@/composables/useAuth'
import { useNotificationStore } from '@/stores/notification.store'
import { rules }     from '@/utils/validators'
import { MESSAGES }  from '@/constants'

const { isDark, setTheme } = useTheme()
const { logout } = useAuth()
const notifStore = useNotificationStore()

const darkMode = computed({
  get: () => isDark.value,
  set: (val) => setTheme(val ? 'dark' : 'light'),
})
const selectedColor = ref('primary')
const deleteDialog  = ref(false)
const changingPwd   = ref(false)
const passwordForm  = ref(null)

const passwords = reactive({ current: '', new: '', confirm: '' })

const colorOptions = [
  { value: 'primary' }, { value: 'purple' }, { value: 'teal' },
  { value: 'orange' },  { value: 'red' },    { value: 'green' },
]

const notifSettings = reactive([
  { key: 'email',  label: 'Notifications par email',     enabled: true  },
  { key: 'push',   label: 'Notifications push',          enabled: true  },
  { key: 'news',   label: 'Newsletters et actualités',   enabled: false },
  { key: 'report', label: 'Rapports hebdomadaires',      enabled: true  },
])

function handleDeleteAccount() {
  deleteDialog.value = false
  logout()
}

async function changePassword() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return
  changingPwd.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    notifStore.success('Mot de passe modifié avec succès.')
    passwords.current = ''
    passwords.new     = ''
    passwords.confirm = ''
    passwordForm.value.reset()
  } catch {
    notifStore.error(MESSAGES.ERROR_GENERIC)
  } finally {
    changingPwd.value = false
  }
}
</script>
