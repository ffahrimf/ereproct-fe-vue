<template>
  <p v-if="message" class="text-[10px] ml-1 mt-1 text-red-500">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
