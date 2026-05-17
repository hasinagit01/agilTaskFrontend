<template>
  <v-footer app color="surface" elevation="1">
    <v-row justify="space-between" align="center" no-gutters class="px-2">
      <v-col cols="auto">
        <span class="text-caption text-medium-emphasis">
          &copy; {{ currentYear }} WalkingDev. All rights reserved.
        </span>
      </v-col>
      <v-col cols="auto">
        <span class="text-caption text-medium-emphasis">
          Powered by WalkingDev
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>
