<template>
  <v-app-bar elevation="1" color="surface">
    <!-- Bouton menu burger -->
    <v-app-bar-nav-icon @click="emit('toggle-drawer')" />

    <!-- Titre / Logo -->
    <v-app-bar-title>
      <span class="font-weight-bold text-primary">{{ appName }}</span>
    </v-app-bar-title>

    <v-spacer />

<!-- Bouton thème -->
    <v-btn :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme" />

    <!-- Menu notifications -->
    <v-btn icon="mdi-bell-outline" class="mr-1" />

    <!-- Menu utilisateur -->
    <v-menu min-width="200">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon class="mr-2">
          <v-avatar color="primary" size="36">
            <span class="text-body-2 font-weight-bold text-white">
              {{ authStore.userInitials }}
            </span>
          </v-avatar>
        </v-btn>
      </template>

      <v-list rounded="lg" elevation="3">
        <v-list-item
          :subtitle="authStore.currentUser?.email"
          :title="authStore.currentUser?.email"
          class="mb-1"
        >
          <template #prepend>
            <v-avatar color="primary" size="40">
              <span class="text-white font-weight-bold">{{ authStore.userInitials }}</span>
            </v-avatar>
          </template>
        </v-list-item>

        <v-divider class="my-1" />

        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Mon profil"
          :to="{ name: 'Profile' }"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Paramètres"
          :to="{ name: 'Settings' }"
          rounded="lg"
        />

        <v-divider class="my-1" />

        <v-list-item
          prepend-icon="mdi-logout"
          title="Déconnexion"
          base-color="error"
          rounded="lg"
          @click="logout"
        />
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme }     from '@/composables/useTheme'
import { useAuth }      from '@/composables/useAuth'
import { APP_NAME }     from '@/constants'

const emit = defineEmits(['toggle-drawer'])

const appName   = APP_NAME
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { logout } = useAuth()
</script>
