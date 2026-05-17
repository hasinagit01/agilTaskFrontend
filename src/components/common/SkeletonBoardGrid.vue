<template>
  <v-row>
    <v-col v-for="i in count" :key="i" cols="12" sm="6" md="4" lg="3">
      <v-card rounded="xl" elevation="0" border>
        <v-card-text class="pa-5">
          <v-skeleton-loader type="avatar" :width="40" :height="40" class="mb-3" />
          <v-skeleton-loader type="heading" class="mb-2" />
          <v-skeleton-loader type="text" width="50%" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
defineProps({
  count: { type: Number, default: 4 },
})
</script>
