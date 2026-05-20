<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    width="380"
  >
    <div class="d-flex align-center justify-space-between pa-4 border-b">
      <span class="text-h6 font-weight-semibold">
        <v-icon icon="mdi-history" class="mr-2" />
        Activité
      </span>
      <v-btn icon="mdi-close" variant="text" density="compact" @click="model = false" />
    </div>

    <div v-if="activityStore.loading" class="pa-6">
      <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-avatar-two-line" class="mb-2" />
    </div>

    <div v-else-if="!activityStore.activities.length" class="pa-8 text-center">
      <v-icon icon="mdi-timeline-outline" size="56" color="medium-emphasis" class="mb-3" />
      <p class="text-body-2 text-medium-emphasis">Aucune activité pour l'instant</p>
    </div>

    <v-list v-else lines="two" class="pa-2">
      <v-list-item
        v-for="activity in activityStore.activities"
        :key="activity.id"
        class="mb-1"
        rounded="lg"
      >
        <template #prepend>
          <v-avatar :color="actionColor(activity.action)" size="36" variant="tonal">
            <v-icon :icon="actionIcon(activity.action)" size="18" />
          </v-avatar>
        </template>
        <v-list-item-title class="text-body-2 font-weight-medium">
          {{ actorName(activity.actor) }}
          <span class="font-weight-regular text-medium-emphasis"> {{ actionLabel(activity) }}</span>
        </v-list-item-title>
        <v-list-item-subtitle class="text-caption mt-1">
          {{ relativeDate(activity.created_at) }}
        </v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { watch } from 'vue'
import { useActivityStore } from '@/stores/activity.store'

const props = defineProps({
  boardId: { type: Number, required: true },
})

const model         = defineModel({ type: Boolean, default: false })
const activityStore = useActivityStore()

watch(model, (open) => {
  if (open) activityStore.fetchActivities(props.boardId)
})

function actorName(actor) {
  if (actor?.firstname && actor?.name) return `${actor.firstname} ${actor.name}`
  return actor?.email ?? 'Quelqu\'un'
}

function actionLabel(activity) {
  const name = activity.entity_name ? `"${activity.entity_name}"` : ''
  const map = {
    created:        `a créé ${name}`,
    updated:        `a modifié ${name}`,
    deleted:        `a supprimé ${name}`,
    moved:          `a déplacé ${name}`,
    archived:       `a archivé ${name}`,
    restored:       `a restauré ${name}`,
    renamed:        `a renommé le board`,
    member_added:   `a ajouté ${name}`,
    member_removed: `a retiré ${name}`,
  }
  return map[activity.action] ?? activity.action
}

function actionIcon(action) {
  const map = {
    created:        'mdi-plus-circle-outline',
    updated:        'mdi-pencil-outline',
    deleted:        'mdi-delete-outline',
    moved:          'mdi-arrow-right-circle-outline',
    archived:       'mdi-archive-arrow-down-outline',
    restored:       'mdi-archive-arrow-up-outline',
    renamed:        'mdi-form-textbox',
    member_added:   'mdi-account-plus-outline',
    member_removed: 'mdi-account-minus-outline',
  }
  return map[action] ?? 'mdi-information-outline'
}

function actionColor(action) {
  const map = {
    created:        'success',
    updated:        'primary',
    deleted:        'error',
    moved:          'info',
    archived:       'warning',
    restored:       'success',
    renamed:        'primary',
    member_added:   'success',
    member_removed: 'error',
  }
  return map[action] ?? 'default'
}

function relativeDate(isoDate) {
  if (!isoDate) return ''
  const now  = new Date()
  const date = new Date(isoDate)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60)   return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`
  return `Il y a ${Math.floor(diff / 86400)} j`
}
</script>
