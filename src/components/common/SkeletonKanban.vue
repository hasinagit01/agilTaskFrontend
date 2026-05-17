<template>
  <div class="d-flex gap-3">
    <div
      v-for="(cardCount, i) in layout"
      :key="i"
      class="skeleton-column pa-3"
    >
      <v-skeleton-loader type="heading" class="mb-4" />
      <v-skeleton-loader
        v-for="j in cardCount"
        :key="j"
        type="text@2"
        class="skeleton-card mb-2 pa-3 rounded-lg"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  columns:    { type: Number, default: 3 },
  cardCounts: { type: Array,  default: () => [3, 2, 4] },
})

const layout = computed(() =>
  Array.from({ length: props.columns }, (_, i) => props.cardCounts[i] ?? 2)
)
</script>

<style scoped>
.skeleton-column {
  background: rgba(var(--v-theme-surface-variant), 0.4);
  border-radius: 12px;
  min-width: 280px;
  width: 280px;
  flex-shrink: 0;
}
.skeleton-card {
  background: rgba(var(--v-theme-surface), 0.9);
}
</style>
