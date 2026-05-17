<template>
  <AuthLayout>
    <v-card rounded="xl" elevation="8" width="460" class="pa-2">
      <v-card-text class="pa-8">
        <!-- Logo & titre -->
        <div class="text-center mb-8">
          <v-icon icon="mdi-hexagon-multiple" color="primary" size="56" class="mb-3" />
          <h1 class="text-h5 font-weight-bold">Créer un compte</h1>
          <p class="text-medium-emphasis text-body-2 mt-1">
            Rejoignez-nous en quelques secondes.
          </p>
        </div>

        <v-form @submit.prevent="onSubmit">
          <BaseInput
            v-model="email"
            v-bind="emailProps"
            label="Email"
            type="email"
            prepend-icon="mdi-email-outline"
            class="mb-3"
          />
          <BaseInput
            v-model="password"
            v-bind="passwordProps"
            label="Mot de passe"
            type="password"
            prepend-icon="mdi-lock-outline"
            class="mb-3"
          />
          <BaseInput
            v-model="confirmPassword"
            v-bind="confirmPasswordProps"
            label="Confirmer le mot de passe"
            type="password"
            prepend-icon="mdi-lock-check-outline"
            class="mb-2"
          />

          <!-- CGU -->
          <v-checkbox
            v-model="acceptTerms"
            color="primary"
            density="compact"
            hide-details
            class="mb-6"
          >
            <template #label>
              <span class="text-body-2">
                J'accepte les
                <a href="#" class="text-primary">conditions d'utilisation</a>
              </span>
            </template>
          </v-checkbox>

          <BaseButton
            type="submit"
            :loading="loading"
            :disabled="!acceptTerms"
            block
            size="large"
            prepend-icon="mdi-account-plus"
          >
            Créer mon compte
          </BaseButton>
        </v-form>

        <div class="text-center mt-6">
          <span class="text-body-2 text-medium-emphasis">Déjà un compte ?</span>
          <v-btn variant="text" color="primary" size="small" :to="{ name: 'Login' }">
            Se connecter
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth } from '@/composables/useAuth'
import { registerSchema } from '@/schemas/auth.schema'

const { register, loading } = useAuth()
const acceptTerms = ref(false)

const { defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(registerSchema),
})

const vuetifyConfig = (state) => ({ props: { 'error-messages': state.errors } })

const [email,           emailProps]           = defineField('email',           vuetifyConfig)
const [password,        passwordProps]        = defineField('password',        vuetifyConfig)
const [confirmPassword, confirmPasswordProps] = defineField('confirmPassword', vuetifyConfig)

const onSubmit = handleSubmit(async (values) => {
  if (!acceptTerms.value) return
  await register({ email: values.email, password: values.password })
})
</script>
