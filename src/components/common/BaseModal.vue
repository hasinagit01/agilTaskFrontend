<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :persistent="persistent"
    :fullscreen="fullscreen"
  >
    <v-card rounded="xl">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-semibold">{{ title }}</span>
        <v-btn
          v-if="!persistent"
          icon="mdi-close"
          variant="text"
          density="compact"
          @click="model = false"
        />
      </v-card-title>

      <v-divider v-if="title" />

      <!-- Content -->
      <v-card-text class="pa-6">
        <slot />
      </v-card-text>

      <!-- Actions -->
      <template v-if="$slots.actions">
        <v-divider />
        <v-card-actions class="pa-4">
          <slot name="actions" />
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel({ type: Boolean, default: false })

defineProps({
  title:      { type: String,  default: ''     },
  maxWidth:   { type: String,  default: '500'  },
  persistent: { type: Boolean, default: false  },
  fullscreen: { type: Boolean, default: false  },
})
</script>
