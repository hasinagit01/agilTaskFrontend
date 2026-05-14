<template>
  <v-text-field
    v-bind="$attrs"
    :model-value="modelValue"
    :label="label"
    :placeholder="placeholder"
    :type="inputType"
    :rules="rules"
    :required="required"
    :disabled="disabled"
    :readonly="readonly"
    :prepend-inner-icon="prependIcon"
    :append-inner-icon="computedAppendIcon"
    :hint="hint"
    :persistent-hint="!!hint"
    :clearable="clearable"
    variant="outlined"
    density="comfortable"
    @update:model-value="emit('update:modelValue', $event)"
    @click:append-inner="handleAppendClick"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

defineOptions({ inheritAttrs: false })

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue:  { type: [String, Number], default: '' },
  label:       { type: String,  default: ''        },
  placeholder: { type: String,  default: ''        },
  type:        { type: String,  default: 'text'    },
  rules:       { type: Array,   default: () => []  },
  required:    { type: Boolean, default: false      },
  disabled:    { type: Boolean, default: false      },
  readonly:    { type: Boolean, default: false      },
  prependIcon: { type: String,  default: undefined  },
  appendIcon:  { type: String,  default: undefined  },
  hint:        { type: String,  default: undefined  },
  clearable:   { type: Boolean, default: false      },
})

const showPassword = ref(false)

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

const computedAppendIcon = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'mdi-eye-off-outline' : 'mdi-eye-outline'
  }
  return props.appendIcon
})

function handleAppendClick() {
  if (props.type === 'password') {
    showPassword.value = !showPassword.value
  }
}
</script>
