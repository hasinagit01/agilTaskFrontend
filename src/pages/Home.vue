<template>
  <DefaultLayout>
    <div>
      <!-- En-tête de page -->
      <div class="d-flex align-center justify-space-between mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold">Tableau de bord</h1>
          <p class="text-medium-emphasis mt-1">
            Bonjour, {{ authStore.currentUser?.name }} 👋
          </p>
        </div>
        <BaseButton prepend-icon="mdi-plus">
          Nouvelle action
        </BaseButton>
      </div>

      <!-- Cartes stats -->
      <v-row class="mb-6">
        <v-col
          v-for="stat in stats"
          :key="stat.label"
          cols="12"
          sm="6"
          lg="3"
        >
          <v-card rounded="xl" elevation="0" border>
            <v-card-text class="pa-5">
              <div class="d-flex align-center justify-space-between mb-3">
                <span class="text-medium-emphasis text-body-2">{{ stat.label }}</span>
                <v-avatar :color="stat.color" size="40" rounded="lg">
                  <v-icon :icon="stat.icon" size="20" color="white" />
                </v-avatar>
              </div>
              <div class="text-h4 font-weight-bold mb-1">{{ stat.value }}</div>
              <div class="d-flex align-center gap-1">
                <v-icon
                  :icon="stat.trend > 0 ? 'mdi-trending-up' : 'mdi-trending-down'"
                  :color="stat.trend > 0 ? 'success' : 'error'"
                  size="16"
                />
                <span
                  :class="stat.trend > 0 ? 'text-success' : 'text-error'"
                  class="text-caption"
                >
                  {{ Math.abs(stat.trend) }}% ce mois
                </span>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Contenu principal -->
      <v-row>
        <v-col cols="12" md="8">
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Activité récente
            </v-card-title>
            <v-card-text>
              <v-list lines="two">
                <v-list-item
                  v-for="activity in activities"
                  :key="activity.id"
                  :title="activity.title"
                  :subtitle="activity.time"
                  rounded="lg"
                  class="mb-1"
                >
                  <template #prepend>
                    <v-avatar :color="activity.color" size="36" rounded="lg">
                      <v-icon :icon="activity.icon" size="18" color="white" />
                    </v-avatar>
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Accès rapide
            </v-card-title>
            <v-card-text>
              <v-list rounded="lg">
                <v-list-item
                  v-for="link in quickLinks"
                  :key="link.title"
                  :prepend-icon="link.icon"
                  :title="link.title"
                  :to="link.to"
                  active-color="primary"
                  rounded="lg"
                  class="mb-1"
                />
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BaseButton    from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.store'

const authStore = useAuthStore()

const stats = [
  { label: 'Utilisateurs',  value: '1 284', icon: 'mdi-account-group', color: 'primary',  trend:  12 },
  { label: 'Ventes',        value: '48 290', icon: 'mdi-cart',          color: 'success',  trend:   8 },
  { label: 'Commandes',     value: '384',    icon: 'mdi-package',       color: 'warning',  trend:  -3 },
  { label: 'Revenus (€)',   value: '9 432',  icon: 'mdi-currency-eur',  color: 'info',     trend:  21 },
]

const activities = [
  { id: 1, title: 'Nouvel utilisateur inscrit',    time: 'il y a 5 min',  icon: 'mdi-account-plus',  color: 'primary' },
  { id: 2, title: 'Commande #4821 validée',        time: 'il y a 18 min', icon: 'mdi-check-circle',  color: 'success' },
  { id: 3, title: 'Paiement reçu — 129 €',         time: 'il y a 1h',    icon: 'mdi-cash',          color: 'info'    },
  { id: 4, title: 'Ticket support #312 résolu',    time: 'il y a 2h',    icon: 'mdi-headset',       color: 'warning' },
  { id: 5, title: 'Mise à jour système déployée',  time: 'il y a 4h',    icon: 'mdi-update',        color: 'secondary'},
]

const quickLinks = [
  { title: 'Mon profil',     icon: 'mdi-account-circle-outline', to: { name: 'Profile'  } },
  { title: 'Paramètres',    icon: 'mdi-cog-outline',             to: { name: 'Settings' } },
  { title: 'À propos',      icon: 'mdi-information-outline',     to: { name: 'About'    } },
]
</script>
