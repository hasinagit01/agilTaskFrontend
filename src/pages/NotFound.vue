<template>
  <div class="fill-height d-flex align-center justify-center">
    <div class="text-center px-4">
      <v-icon icon="mdi-magnify-close" size="96" color="primary" class="mb-4" />
      <h1 class="text-h2 font-weight-bold text-primary mb-2">404</h1>
      <h2 class="text-h5 mb-4">Page introuvable</h2>
      <p class="text-medium-emphasis mb-8 text-body-1">
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <BaseButton prepend-icon="mdi-home-outline" size="large" :to="{ name: 'Home' }">
        Retour à l'accueil
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '@/components/common/BaseButton.vue'
</script>
