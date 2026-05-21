<template>
  <div class="fill-height d-flex align-center justify-center">
    <div class="text-center px-4">
      <v-icon :icon="config.icon" size="96" :color="config.color" class="mb-4" />
      <h1 class="text-h2 font-weight-bold mb-2"><span class="page-title">{{ config.code }}</span></h1>
      <h2 class="text-h5 mb-4">{{ config.title }}</h2>
      <p class="text-medium-emphasis mb-8 text-body-1">{{ config.description }}</p>

      <div class="d-flex justify-center gap-3 flex-wrap">
        <BaseButton
          variant="tonal"
          color="secondary"
          prepend-icon="mdi-refresh"
          @click="retry"
        >
          Réessayer
        </BaseButton>
        <BaseButton prepend-icon="mdi-home-outline" :to="{ name: 'Home' }">
          Retour à l'accueil
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/common/BaseButton.vue'

const route  = useRoute()
const router = useRouter()

const CONFIGS = {
  403: {
    code:        '403',
    icon:        'mdi-lock-outline',
    color:       'warning',
    title:       'Accès refusé',
    description: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
  },
  500: {
    code:        '500',
    icon:        'mdi-server-network-off',
    color:       'error',
    title:       'Erreur serveur',
    description: 'Le serveur a rencontré une erreur inattendue. Veuillez réessayer dans quelques instants.',
  },
  network: {
    code:        '503',
    icon:        'mdi-wifi-off',
    color:       'warning',
    title:       'Erreur réseau',
    description: 'Impossible de contacter le serveur. Vérifiez votre connexion internet.',
  },
  default: {
    code:        'Oops',
    icon:        'mdi-alert-circle-outline',
    color:       'error',
    title:       'Une erreur est survenue',
    description: 'Quelque chose s\'est mal passé. Veuillez réessayer ou revenir à l\'accueil.',
  },
}

const config = computed(() => {
  const code = route.query.code
  return CONFIGS[code] ?? CONFIGS.default
})

function retry() {
  router.back()
}
</script>
