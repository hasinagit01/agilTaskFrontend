<template>
  <v-layout class="fill-height">
    <v-main>
      <v-container
        class="fill-height d-flex align-center justify-center"
        fluid
      >
        <transition name="slide-up" mode="out-in">
          <slot />
        </transition>
      </v-container>
    </v-main>
    <NotificationStack />
  </v-layout>
</template>

<script setup>
import NotificationStack from '@/components/common/NotificationStack.vue'
</script>

<style scoped>
.v-main {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}
</style>
