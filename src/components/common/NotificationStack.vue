<template>
  <div class="notification-stack">
    <transition-group name="notif" tag="div">
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
    </transition-group>
  </div>
</template>

<script setup>
import { useNotificationStore } from '@/stores/notification.store'
const notifStore = useNotificationStore()
</script>

<style scoped>
.notif-enter-active,
.notif-leave-active {
  transition: all 0.3s ease;
}
.notif-enter-from {
  opacity: 0;
  transform: translateX(40px);
}
.notif-leave-to {
  opacity: 0;
  transform: translateX(40px);
}
</style>
