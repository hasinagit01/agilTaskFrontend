<template>
  <v-dialog
    v-model="model"
    :max-width="maxWidth"
    :persistent="persistent || loading"
    :fullscreen="fullscreen"
  >
    <v-card>
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6 font-weight-semibold">{{ title }}</span>
        <v-btn
          v-if="!persistent && !loading"
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

      <!-- Actions par slot ou boutons par défaut -->
      <template v-if="$slots.actions || confirmText">
        <v-divider />
        <v-card-actions class="pa-4 gap-2">
          <template v-if="$slots.actions">
            <slot name="actions" />
          </template>
          <template v-else>
            <v-spacer />
            <v-btn
              variant="text"
              :disabled="loading"
              @click="model = false"
            >
              {{ cancelText }}
            </v-btn>
            <v-btn
              :color="confirmColor"
              variant="flat"
              :loading="loading"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </v-btn>
          </template>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel({ type: Boolean, default: false })

defineProps({
  title:        { type: String,  default: ''         },
  maxWidth:     { type: String,  default: '500'       },
  persistent:   { type: Boolean, default: false       },
  fullscreen:   { type: Boolean, default: false       },
  confirmText:  { type: String,  default: 'Confirmer' },
  cancelText:   { type: String,  default: 'Annuler'   },
  confirmColor: { type: String,  default: 'primary'   },
  loading:      { type: Boolean, default: false       },
})

defineEmits(['confirm'])
</script>
