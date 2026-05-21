<template>
  <v-app-bar elevation="1" color="surface">
    <!-- Bouton menu burger (mobile uniquement) -->
    <v-app-bar-nav-icon v-if="mobile" @click="emit('toggle-drawer')" />


    <v-spacer />

<!-- Bouton thème -->
    <v-btn :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme" />

    <!-- Menu notifications -->
    <v-btn icon="mdi-bell-outline" class="mr-1" />

    <!-- Menu utilisateur -->
    <v-menu min-width="200">
      <template #activator="{ props }">
        <v-btn v-bind="props" icon class="mr-2">
          <UserAvatar :user="authStore.currentUser" :size="36" />
        </v-btn>
      </template>

      <v-list rounded="lg" elevation="3">
        <v-list-item
          :subtitle="authStore.currentUser?.email"
          :title="authStore.currentUser?.email"
          class="mb-1"
        >
          <template #prepend>
            <UserAvatar :user="authStore.currentUser" :size="40" />
          </template>
        </v-list-item>

        <v-divider class="my-1" />

        <v-list-item
          prepend-icon="mdi-account-outline"
          title="Mon profil"
          :to="{ name: 'Profile' }"
          base-color="primary"
          rounded="lg"
        />
        <v-list-item
          prepend-icon="mdi-cog-outline"
          title="Paramètres"
          :to="{ name: 'Settings' }"
          base-color="primary"
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
import { useDisplay }   from 'vuetify'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme }     from '@/composables/useTheme'
import { useAuth }      from '@/composables/useAuth'
import UserAvatar from '@/components/common/UserAvatar.vue'

const { mobile } = useDisplay()

const emit = defineEmits(['toggle-drawer'])

const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { logout } = useAuth()
</script>
