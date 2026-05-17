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
            <div class="text-h6 font-weight-bold mb-1">{{ authStore.currentUser?.email }}</div>
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
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Informations du compte
            </v-card-title>
            <v-card-text class="pa-5">
              <v-list>
                <v-list-item
                  prepend-icon="mdi-identifier"
                  title="Identifiant"
                  :subtitle="String(authStore.currentUser?.id)"
                />
                <v-divider class="my-2" />
                <v-list-item
                  prepend-icon="mdi-email-outline"
                  title="Email"
                  :subtitle="authStore.currentUser?.email"
                />
              </v-list>

              <v-alert type="info" variant="tonal" class="mt-4" icon="mdi-information-outline" density="compact">
                La modification du profil n'est pas disponible dans cette version.
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
import DefaultLayout  from '@/layouts/DefaultLayout.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const joinDate = computed(() => {
  const d = authStore.currentUser?.created_at
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
})
</script>
