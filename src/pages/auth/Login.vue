<template>
  <AuthLayout>
    <v-card rounded="xl" elevation="8" width="420" class="pa-2">
      <v-card-text class="pa-8">
        <!-- Logo & titre -->
        <div class="text-center mb-8">
          <v-icon icon="mdi-hexagon-multiple" color="primary" size="56" class="mb-3" />
          <h1 class="text-h5 font-weight-bold">Connexion</h1>
          <p class="text-medium-emphasis text-body-2 mt-1">
            Bienvenue ! Entrez vos identifiants.
          </p>
        </div>

        <v-form ref="formRef" @submit.prevent="handleLogin">
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
            :rules="[rules.required, rules.minLength(6)]"
            class="mb-1"
          />

          <div class="d-flex justify-end mb-6">
            <v-btn variant="text" size="small" color="primary" class="text-caption">
              Mot de passe oublié ?
            </v-btn>
          </div>

          <BaseButton
            type="submit"
            :loading="loading"
            block
            size="large"
            prepend-icon="mdi-login"
          >
            Se connecter
          </BaseButton>
        </v-form>

        <v-divider class="my-6">
          <span class="text-caption text-medium-emphasis px-2">OU</span>
        </v-divider>

        <div class="text-center">
          <span class="text-body-2 text-medium-emphasis">Pas encore de compte ?</span>
          <v-btn variant="text" color="primary" size="small" :to="{ name: 'Register' }">
            S'inscrire
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

const { login, loading } = useAuth()
const formRef = ref(null)

const form = reactive({ email: '', password: '' })

async function handleLogin() {
  const { valid } = await formRef.value.validate()
  if (!valid) return
  await login(form)
}
</script>
