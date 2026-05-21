<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Hexagone haut-gauche -->
    <polygon points="7,3 11.3,5.5 11.3,10.5 7,13 2.7,10.5 2.7,5.5" fill="#6366f1" />
    <!-- Hexagone haut-droite -->
    <polygon points="17,3 21.3,5.5 21.3,10.5 17,13 12.7,10.5 12.7,5.5" fill="#d69e2e" />
    <!-- Hexagone bas-centre -->
    <polygon points="12,12 16.3,14.5 16.3,19.5 12,22 7.7,19.5 7.7,14.5" fill="#6366f1" />
  </svg>
</template>

<script setup>
defineProps({
  size: { type: Number, default: 28 },
})
</script>
