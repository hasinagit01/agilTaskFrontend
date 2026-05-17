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
              <v-alert type="info" variant="tonal" icon="mdi-information-outline" density="compact">
                Le changement de mot de passe n'est pas disponible dans cette version.
              </v-alert>
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
import BaseButton    from '@/components/common/BaseButton.vue'
import BaseModal     from '@/components/common/BaseModal.vue'
import { useTheme }  from '@/composables/useTheme'
import { useAuth }   from '@/composables/useAuth'

const { isDark, setTheme } = useTheme()
const { logout } = useAuth()

const darkMode = computed({
  get: () => isDark.value,
  set: (val) => setTheme(val ? 'dark' : 'light'),
})
const selectedColor = ref('primary')
const deleteDialog  = ref(false)

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

</script>
