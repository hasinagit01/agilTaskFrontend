<template>
  <v-avatar :color="color" :size="size">
    <span :class="initialsClass">{{ initials }}</span>
  </v-avatar>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user:  { type: Object, required: true },
  size:  { type: [Number, String], default: 32 },
  color: { type: String, default: 'primary' },
})

const initials = computed(() => {
  const u = props.user
  if (u?.firstname && u?.name) return (u.firstname[0] + u.name[0]).toUpperCase()
  return u?.email?.[0]?.toUpperCase() ?? '?'
})

const initialsClass = computed(() => {
  const s = parseInt(props.size)
  if (s < 30) return 'ua-initials ua-initials--xs'
  if (s < 50) return 'ua-initials ua-initials--sm'
  if (s < 80) return 'ua-initials ua-initials--md'
  return 'ua-initials ua-initials--lg'
})
</script>

<style scoped>
.ua-initials     { font-weight: 600; }
.ua-initials--xs { font-size: 0.625rem; } /* 10px — avatar ≤ 29px */
.ua-initials--sm { font-size: 0.75rem;  } /* 12px — avatar 30-49px */
.ua-initials--md { font-size: 1.125rem; } /* 18px — avatar 50-79px */
.ua-initials--lg { font-size: 1.75rem;  } /* 28px — avatar ≥ 80px  */
</style>
