<template>
  <v-app-bar elevation="1" color="surface">
    <!-- Bouton menu burger (mobile uniquement) -->
    <v-app-bar-nav-icon v-if="mobile" @click="emit('toggle-drawer')" />


    <v-spacer />

<!-- Bouton thème -->
    <v-btn :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'" @click="toggleTheme" />

    <!-- Menu notifications -->
    <v-menu min-width="320" max-width="360" :close-on-content-click="false" @update:model-value="onBellOpen">
      <template #activator="{ props: bellProps }">
        <v-btn icon v-bind="bellProps" class="mr-1">
          <v-badge
            :content="notifStore.unreadCount"
            :model-value="notifStore.hasUnread"
            color="error"
            floating
          >
            <v-icon icon="mdi-bell-outline" />
          </v-badge>
        </v-btn>
      </template>

      <v-card rounded="lg" elevation="3">
        <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
          <span class="text-body-1 font-weight-semibold">Notifications</span>
          <v-btn
            v-if="notifStore.history.length"
            variant="text"
            size="x-small"
            color="primary"
            @click="notifStore.clearHistory()"
          >
            Tout effacer
          </v-btn>
        </v-card-title>

        <v-divider />

        <v-list v-if="notifStore.history.length" lines="two" class="pa-1">
          <v-list-item
            v-for="n in notifStore.history"
            :key="n.id"
            :subtitle="formatRelativeTime(n.created_at)"
            rounded="lg"
            class="mb-1"
          >
            <template #prepend>
              <v-avatar :color="n.color" size="32" variant="tonal" class="mr-1">
                <v-icon :icon="n.icon || 'mdi-bell'" size="16" />
              </v-avatar>
            </template>
            <template #title>
              <span class="text-body-2">{{ n.message }}</span>
            </template>
          </v-list-item>
        </v-list>

        <div v-else class="pa-6 text-center">
          <v-icon icon="mdi-bell-off-outline" size="36" color="medium-emphasis" class="mb-2" />
          <p class="text-caption text-medium-emphasis">Aucune notification</p>
        </div>
      </v-card>
    </v-menu>

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
import { useNotificationStore } from '@/stores/notification.store'
import { useTheme }     from '@/composables/useTheme'
import { useAuth }      from '@/composables/useAuth'
import { formatRelativeTime } from '@/utils/date'
import UserAvatar from '@/components/common/UserAvatar.vue'

const { mobile } = useDisplay()

const emit = defineEmits(['toggle-drawer'])

const authStore   = useAuthStore()
const notifStore  = useNotificationStore()

function onBellOpen(open) {
  if (open) notifStore.markAllRead()
}
const { isDark, toggleTheme } = useTheme()
const { logout } = useAuth()
</script>
