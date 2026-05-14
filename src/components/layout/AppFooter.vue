<template>
  <v-footer app color="surface" elevation="1">
    <v-row justify="space-between" align="center" no-gutters class="px-2">
      <v-col cols="auto">
        <span class="text-caption text-medium-emphasis">
          &copy; {{ currentYear }} {{ appName }}. Tous droits réservés.
        </span>
      </v-col>
      <v-col cols="auto">
        <span class="text-caption text-medium-emphasis">
          Made with
          <v-icon icon="mdi-heart" size="12" color="error" />
          Vue 3 + Vuetify
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
import { APP_NAME } from '@/constants'

const appName    = APP_NAME
const currentYear = new Date().getFullYear()
</script>
