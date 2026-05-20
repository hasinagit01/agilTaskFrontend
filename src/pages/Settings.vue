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
              <v-alert type="warning" variant="tonal" icon="mdi-delete-off-outline" density="compact">
                La suppression de compte n'est pas disponible dans cette version.
              </v-alert>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { computed } from 'vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, setTheme } = useTheme()

const darkMode = computed({
  get: () => isDark.value,
  set: (val) => setTheme(val ? 'dark' : 'light'),
})
</script>
