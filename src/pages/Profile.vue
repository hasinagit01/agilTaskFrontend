<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-6">Mon profil</h1>

      <v-row>
        <!-- Carte profil -->
        <v-col cols="12" md="4">
          <v-card rounded="xl" elevation="0" border class="text-center pa-4">
            <v-avatar color="primary" size="96" class="mb-4">
              <span class="text-h4 text-white font-weight-bold">
                {{ authStore.userInitials }}
              </span>
            </v-avatar>
            <div class="text-h6 font-weight-bold">{{ authStore.currentUser?.name }}</div>
            <div class="text-medium-emphasis text-body-2 mb-4">{{ authStore.currentUser?.email }}</div>
            <v-chip :color="authStore.isAdmin ? 'error' : 'primary'" variant="tonal" size="small">
              {{ authStore.isAdmin ? 'Administrateur' : 'Utilisateur' }}
            </v-chip>
          </v-card>
        </v-col>

        <!-- Formulaire de modification -->
        <v-col cols="12" md="8">
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-0 font-weight-semibold">
              Modifier mes informations
            </v-card-title>
            <v-card-text class="pa-5">
              <v-form ref="formRef" @submit.prevent="handleSave">
                <v-row>
                  <v-col cols="12" sm="6">
                    <BaseInput
                      v-model="form.name"
                      label="Nom complet"
                      prepend-icon="mdi-account-outline"
                      :rules="[rules.required, rules.minLength(2)]"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <BaseInput
                      v-model="form.email"
                      label="Email"
                      type="email"
                      prepend-icon="mdi-email-outline"
                      :rules="[rules.required, rules.email]"
                    />
                  </v-col>
                  <v-col cols="12">
                    <BaseInput
                      v-model="form.phone"
                      label="Téléphone (optionnel)"
                      prepend-icon="mdi-phone-outline"
                      :rules="[rules.phone]"
                    />
                  </v-col>
                </v-row>

                <div class="d-flex justify-end gap-3 mt-2">
                  <BaseButton variant="tonal" color="secondary" @click="resetForm">
                    Annuler
                  </BaseButton>
                  <BaseButton type="submit" :loading="saving" prepend-icon="mdi-content-save-outline">
                    Enregistrer
                  </BaseButton>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import DefaultLayout  from '@/layouts/DefaultLayout.vue'
import BaseInput      from '@/components/common/BaseInput.vue'
import BaseButton     from '@/components/common/BaseButton.vue'
import { useAuthStore } from '@/stores/auth.store'
import { useNotificationStore } from '@/stores/notification.store'
import { rules }      from '@/utils/validators'
import { MESSAGES }   from '@/constants'

const authStore  = useAuthStore()
const notifStore = useNotificationStore()
const formRef    = ref(null)
const saving     = ref(false)

const form = reactive({
  name:  authStore.currentUser?.name  || '',
  email: authStore.currentUser?.email || '',
  phone: authStore.currentUser?.phone || '',
})

function resetForm() {
  form.name  = authStore.currentUser?.name  || ''
  form.email = authStore.currentUser?.email || ''
  form.phone = authStore.currentUser?.phone || ''
}

watch(() => authStore.currentUser, resetForm, { deep: true })

async function handleSave() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  saving.value = true
  try {
    // await userService.update(authStore.currentUser.id, form)
    await new Promise(r => setTimeout(r, 800)) // simulé
    authStore.user = { ...authStore.currentUser, ...form }
    notifStore.success(MESSAGES.SAVE_SUCCESS)
  } catch (e) {
    notifStore.error(MESSAGES.ERROR_GENERIC)
  } finally {
    saving.value = false
  }
}
</script>
