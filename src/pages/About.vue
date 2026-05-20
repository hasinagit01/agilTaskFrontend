<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-6 page-title">À propos</h1>
      <p class="text-medium-emphasis mb-6">Découvrez Agil Task et WalkingDev.</p>

      <v-row>
        <!-- Description de l'app -->
        <v-col cols="12">
          <v-card rounded="xl" elevation="0" border class="mb-4">
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4" style="gap: 16px">
                <v-icon icon="mdi-view-kanban" color="primary" size="48" />
                <div>
                  <div class="text-h5 font-weight-bold">Agil Task</div>
                  <div class="text-medium-emphasis">Gestion de projet Kanban</div>
                </div>
              </div>
              <p class="text-body-1 mb-6">
                Agil Task est une application de gestion de projet inspirée de Trello. Elle permet
                d'organiser vos tâches en boards Kanban, de collaborer avec votre équipe et de
                suivre l'avancement de vos projets en temps réel.
              </p>

              <v-divider class="mb-5" />

              <p class="text-body-2 font-weight-semibold mb-4 text-medium-emphasis">FONCTIONNALITÉS</p>
              <v-row>
                <v-col
                  v-for="feature in features"
                  :key="feature.title"
                  cols="12"
                  sm="6"
                  md="4"
                >
                  <div class="d-flex align-start" style="gap: 12px">
                    <v-avatar :color="feature.color" size="36" rounded="lg">
                      <v-icon :icon="feature.icon" size="18" color="white" />
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-semibold">{{ feature.title }}</div>
                      <div class="text-caption text-medium-emphasis">{{ feature.description }}</div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- WalkingDev -->
        <v-col cols="12">
          <v-card rounded="xl" elevation="0" border>
            <v-card-text class="pa-6">
              <div class="d-flex align-center mb-4" style="gap: 16px">
                <v-icon icon="mdi-code-braces" color="primary" size="48" />
                <div>
                  <div class="text-h5 font-weight-bold">WalkingDev</div>
                  <div class="text-medium-emphasis">Développement & Conseil digital</div>
                </div>
              </div>
              <p class="text-body-1 mb-6">
                WalkingDev accompagne les entreprises dans leur transformation numérique en
                proposant des solutions sur mesure, de la conception à la mise en production.
              </p>

              <v-divider class="mb-5" />

              <p class="text-body-2 font-weight-semibold mb-4 text-medium-emphasis">SERVICES PROPOSÉS</p>
              <v-list lines="two">
                <v-list-item
                  v-for="service in services"
                  :key="service.title"
                  :title="service.title"
                  :subtitle="service.subtitle"
                  rounded="lg"
                  class="mb-2 px-3"
                >
                  <template #prepend>
                    <v-avatar color="primary" variant="tonal" size="36" rounded="lg" class="mr-1">
                      <v-icon :icon="service.icon" size="18" />
                    </v-avatar>
                  </template>
                </v-list-item>
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

const features = [
  {
    title: 'Boards Kanban',
    description: 'Organisez vos projets en boards personnalisables',
    icon: 'mdi-view-kanban-outline',
    color: '#6366f1',
  },
  {
    title: 'Colonnes & Cartes',
    description: 'Structurez vos tâches en colonnes et cartes',
    icon: 'mdi-card-text-outline',
    color: '#8b5cf6',
  },
  {
    title: 'Labels colorés',
    description: 'Catégorisez vos cartes avec des labels',
    icon: 'mdi-label-outline',
    color: '#22c55e',
  },
  {
    title: 'Membres & Rôles',
    description: 'Invitez votre équipe et gérez les accès',
    icon: 'mdi-account-group-outline',
    color: '#3b82f6',
  },
  {
    title: 'Dates d\'échéance',
    description: 'Suivez les deadlines avec des alertes visuelles',
    icon: 'mdi-calendar-check-outline',
    color: '#f59e0b',
  },
  {
    title: 'Drag & Drop',
    description: 'Déplacez vos cartes intuitivement',
    icon: 'mdi-cursor-move',
    color: '#ef4444',
  },
]

const services = [
  {
    title: 'Applications web sur mesure',
    subtitle: 'Python, Data, IA LLM, automatisation, Laravel, Symfony, Vue.js, React.js',
    icon: 'mdi-web',
  },
  {
    title: 'Plateformes e-commerce & réservation',
    subtitle: 'Conception et développement de solutions marchandes complètes',
    icon: 'mdi-shopping-outline',
  },
  {
    title: 'Intégration front-end moderne',
    subtitle: 'Interfaces responsives, UX/UI soignée et accessibilité',
    icon: 'mdi-monitor-dashboard',
  },
  {
    title: 'Optimisation de la performance',
    subtitle: 'Audit, refactoring et amélioration des temps de chargement',
    icon: 'mdi-speedometer',
  },
  {
    title: 'Déploiement & maintenance',
    subtitle: 'Docker, Heroku, Vercel, AWS — CI/CD et suivi en production',
    icon: 'mdi-cloud-upload-outline',
  },
]
</script>
