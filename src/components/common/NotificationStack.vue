<template>
  <div class="notification-stack">
    <v-snackbar
      v-for="notif in notifStore.notifications"
      :key="notif.id"
      :model-value="notif.visible"
      :timeout="notif.timeout"
      :color="notif.color"
      @update:model-value="val => !val && notifStore.remove(notif.id)"
      location="top right"
      multi-line
      rounded="lg"
      elevation="4"
    >
      <div class="d-flex align-center gap-2">
        <v-icon v-if="notif.icon" :icon="notif.icon" size="20" />
        <span>{{ notif.message }}</span>
      </div>

      <template #actions>
        <v-btn variant="text" icon="mdi-close" size="small" @click="notifStore.remove(notif.id)" />
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification.store'
const notifStore = useNotificationStore()
</script>

