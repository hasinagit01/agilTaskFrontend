<template>
  <v-btn
    v-bind="$attrs"
    :color="color"
    :variant="variant"
    :size="size"
    :loading="loading"
    :disabled="disabled || loading"
    :prepend-icon="prependIcon"
    :append-icon="appendIcon"
    :block="block"
    @click="emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>

<script setup>
const emit = defineEmits(['click'])

defineProps({
  color:       { type: String,  default: 'primary'  },
  variant:     { type: String,  default: 'elevated' },
  size:        { type: String,  default: 'default'  },
  loading:     { type: Boolean, default: false       },
  disabled:    { type: Boolean, default: false       },
  prependIcon: { type: String,  default: undefined   },
  appendIcon:  { type: String,  default: undefined   },
  block:       { type: Boolean, default: false       },
})
</script>
