<template>
  <v-navigation-drawer v-model="model" :rail="rail" permanent>
    <!-- Logo + toggle rail -->
    <v-list-item
      :title="rail ? '' : APP_NAME"
      nav
      class="py-4"
    >
      <template #prepend>
        <v-icon icon="mdi-hexagon-multiple" color="primary" size="28" />
      </template>
      <template #append>
        <v-btn
          :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
          variant="text"
          @click="rail = !rail"
        />
      </template>
    </v-list-item>

    <v-divider />

    <!-- Navigation principale -->
    <v-list density="compact" nav class="mt-2">
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        :value="item.title"
        rounded="lg"
        color="primary"
        class="mb-1"
      />
    </v-list>

    <!-- Section Admin (si admin) -->
    <template v-if="isAdmin">
      <v-divider class="my-2" />
      <v-list-subheader v-if="!rail">Administration</v-list-subheader>
      <v-list density="compact" nav>
        <v-list-item
          v-for="item in adminItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          :value="item.title"
          rounded="lg"
          color="primary"
          class="mb-1"
        />
      </v-list>
    </template>

    <!-- Profil en bas -->
    <template #append>
      <v-divider />
      <v-list-item
        :subtitle="currentUser?.email"
        :title="currentUser?.email"
        nav
        class="py-3"
        :to="{ name: 'Profile' }"
      >
        <template #prepend>
          <v-avatar color="primary" size="32">
            <span class="text-caption text-white font-weight-bold">
              {{ authStore.userInitials }}
            </span>
          </v-avatar>
        </template>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { APP_NAME }     from '@/constants'

const model = defineModel({ type: Boolean, default: true })

const authStore   = useAuthStore()
const currentUser = computed(() => authStore.currentUser)
const isAdmin     = computed(() => authStore.isAdmin)
const rail        = ref(false)

const navItems = [
  { title: 'Mes boards',  icon: 'mdi-view-kanban-outline', to: { name: 'Home' }     },
  { title: 'Profil',      icon: 'mdi-account-outline',     to: { name: 'Profile' }  },
  { title: 'Paramètres',  icon: 'mdi-cog-outline',         to: { name: 'Settings' } },
  { title: 'À propos',    icon: 'mdi-information-outline', to: { name: 'About' }    },
]

const adminItems = [
  { title: 'Utilisateurs', icon: 'mdi-account-group-outline', to: '/admin/users'     },
  { title: 'Tableau bord', icon: 'mdi-view-dashboard-outline',to: '/admin/dashboard' },
]
</script>
