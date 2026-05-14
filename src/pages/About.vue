<template>
  <DefaultLayout>
    <div>
      <h1 class="text-h4 font-weight-bold mb-2">À propos</h1>
      <p class="text-medium-emphasis mb-6">Informations sur cette application.</p>

      <v-row>
        <v-col cols="12" md="6">
          <v-card rounded="xl" elevation="0" border class="pa-2">
            <v-card-text>
              <div class="d-flex align-center gap-3 mb-4">
                <v-icon icon="mdi-hexagon-multiple" color="primary" size="48" />
                <div>
                  <div class="text-h6 font-weight-bold">{{ appName }}</div>
                  <div class="text-medium-emphasis">Version 1.0.0</div>
                </div>
              </div>
              <p class="text-body-1">
                Application construite avec Vue 3, Vuetify 3 et Pinia.
                Architecture modulaire et scalable utilisant la Composition API.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card rounded="xl" elevation="0" border>
            <v-card-title class="pa-5 pb-2 font-weight-semibold">Stack technique</v-card-title>
            <v-list density="compact" class="px-3 pb-3">
              <v-list-item
                v-for="tech in stack"
                :key="tech.name"
                :title="tech.name"
                :subtitle="tech.version"
                rounded="lg"
                class="mb-1"
              >
                <template #prepend>
                  <v-avatar :color="tech.color" size="32" rounded="lg">
                    <v-icon :icon="tech.icon" size="16" color="white" />
                  </v-avatar>
                </template>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </DefaultLayout>
</template>

<script setup>
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { APP_NAME }  from '@/constants'

const appName = APP_NAME

const stack = [
  { name: 'Vue 3',      version: '^3.4.0',  icon: 'mdi-vuejs',          color: '#42b883' },
  { name: 'Vuetify 3',  version: '^3.5.0',  icon: 'mdi-material-design', color: '#1867c0' },
  { name: 'Pinia',      version: '^2.1.7',  icon: 'mdi-pine-tree',       color: '#ffd859' },
  { name: 'Vue Router', version: '^4.3.0',  icon: 'mdi-routes',          color: '#42b883' },
  { name: 'Axios',      version: '^1.6.0',  icon: 'mdi-web',             color: '#5a29e4' },
  { name: 'Vite',       version: '^5.0.0',  icon: 'mdi-lightning-bolt',  color: '#646cff' },
]
</script>
