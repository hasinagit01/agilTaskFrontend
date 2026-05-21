<template>
  <v-navigation-drawer
    v-model="model"
    :rail="!mobile && rail"
    :rail-width="72"
    :temporary="mobile"
    :permanent="!mobile"
    class="sidebar"
    @mouseenter="!mobile && (rail = false)"
    @mouseleave="!mobile && (rail = true)"
  >
    <!-- Logo + Titre -->
    <div class="d-flex align-center py-4 px-4 gap-5">
      <AppLogo :size="28" />
      <span v-if="!rail" class="app-title">{{ APP_NAME }}</span>
    </div>

    <!-- Navigation principale -->
    <v-list density="compact" nav class="mt-2">
      <v-list-item
        v-for="item in navItems"
        :key="item.title"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="item.to"
        :value="item.title"
        :active="isItemActive(item)"
        rounded="lg"
        color="primary"
        class="mb-1 nav-item"
      />
    </v-list>

    <!-- Profil en bas -->
    <template #append>
      <v-divider />
      <v-list-item
        :subtitle="rail ? '' : currentUser?.email"
        :title="rail ? '' : (fullName || currentUser?.email)"
        nav
        class="py-3"
        :to="{ name: 'Profile' }"
      >
        <template #prepend>
          <UserAvatar :user="authStore.currentUser" :size="32" />
        </template>
      </v-list-item>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { APP_NAME } from '@/constants'
import AppLogo from '@/components/common/AppLogo.vue'
import UserAvatar from '@/components/common/UserAvatar.vue'
import { getUserFullName } from '@/utils/user'

const model = defineModel({ type: Boolean, default: true })

const { mobile }  = useDisplay()
const route       = useRoute()
const authStore   = useAuthStore()
const currentUser = computed(() => authStore.currentUser)
const rail        = ref(true)

const fullName = computed(() => getUserFullName(currentUser.value))

const navItems = [
  { title: 'Mes boards',  icon: 'mdi-view-dashboard-outline', to: { name: 'Home' },     activeRoutes: ['Home', 'BoardDetail'] },
  { title: 'Profil',      icon: 'mdi-account-outline',        to: { name: 'Profile' },  activeRoutes: ['Profile']  },
  { title: 'Paramètres',  icon: 'mdi-cog-outline',            to: { name: 'Settings' }, activeRoutes: ['Settings'] },
  { title: 'À propos',    icon: 'mdi-information-outline',    to: { name: 'About' },    activeRoutes: ['About']    },
]

function isItemActive(item) {
  return item.activeRoutes.includes(route.name)
}
</script>

<style scoped>
.sidebar {
  transition: width 0.2s ease !important;
}

:deep(.nav-item .v-list-item-title) {
  font-weight: 600;
  font-size: 0.9rem;
}

.app-title {
  color: #d69e2e;
  font-weight: 700;
  font-size: 1rem;
  white-space: nowrap;
}

/* Inactifs en mode clair → gris neutre pour ne pas confondre avec les boutons */
:global(.v-theme--light) :deep(.nav-item:not(.v-list-item--active) .v-icon),
:global(.v-theme--light) :deep(.nav-item:not(.v-list-item--active) .v-list-item-title) {
  color: #64748b !important;
}

/* Hover + actif → couleur ambrée */
:deep(.v-list-item:hover .v-icon),
:deep(.v-list-item--active .v-icon) {
  color: #d69e2e !important;
}

:deep(.v-list-item:hover .v-list-item-title),
:deep(.v-list-item--active .v-list-item-title) {
  color: #d69e2e !important;
}

:deep(.v-list-item--active) {
  border-left: 3px solid #d69e2e !important;
}

:deep(.v-list-item:not(.v-list-item--active)) {
  border-left: 3px solid transparent;
}
</style>
