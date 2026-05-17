<template>
  <v-layout class="fill-height">
    <!-- Navigation latérale -->
    <AppSidebar v-model="drawer" />

    <!-- Header -->
    <AppHeader @toggle-drawer="drawer = !drawer" />

    <!-- Contenu principal -->
    <v-main>
      <v-container fluid :class="mobile ? 'pa-3' : 'pa-6'">
        <slot />
      </v-container>
    </v-main>

    <!-- Footer -->
    <AppFooter />

    <!-- Notifications globales -->
    <NotificationStack />
  </v-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import AppHeader        from '@/components/layout/AppHeader.vue'
import AppSidebar       from '@/components/layout/AppSidebar.vue'
import AppFooter        from '@/components/layout/AppFooter.vue'
import NotificationStack from '@/components/common/NotificationStack.vue'

const { mobile } = useDisplay()
const drawer = ref(!mobile.value)
</script>
