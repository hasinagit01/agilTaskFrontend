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

        <v-form ref="formRef" @submit.prevent="handleRegister">
          <BaseInput
            v-model="form.name"
            label="Nom complet"
            prepend-icon="mdi-account-outline"
            :rules="[rules.required, rules.minLength(2)]"
            class="mb-3"
          />
          <BaseInput
            v-model="form.email"
            label="Email"
            type="email"
            prepend-icon="mdi-email-outline"
            :rules="[rules.required, rules.email]"
            class="mb-3"
          />
          <BaseInput
            v-model="form.password"
            label="Mot de passe"
            type="password"
            prepend-icon="mdi-lock-outline"
            :rules="[rules.required, rules.password]"
            class="mb-3"
          />
          <BaseInput
            v-model="form.confirmPassword"
            label="Confirmer le mot de passe"
            type="password"
            prepend-icon="mdi-lock-check-outline"
            :rules="[rules.required, rules.confirmPassword(form.password)]"
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
import { ref, reactive } from 'vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BaseInput  from '@/components/common/BaseInput.vue'
import BaseButton from '@/components/common/BaseButton.vue'
import { useAuth }from '@/composables/useAuth'
import { rules }  from '@/utils/validators'

const { register, loading } = useAuth()
const formRef     = ref(null)
const acceptTerms = ref(false)

const form = reactive({ name: '', email: '', password: '', confirmPassword: '' })

async function handleRegister() {
  const { valid } = await formRef.value.validate()
  if (!valid || !acceptTerms.value) return
  const { name, email, password } = form
  await register({ name, email, password })
}
</script>
