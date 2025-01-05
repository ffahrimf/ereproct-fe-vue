<template>
  <div class="mb-1">
    <label class="text-sm font-medium text-slate-700" :for="id">{{
      label
    }}</label>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  label: string;
}>();
</script>
