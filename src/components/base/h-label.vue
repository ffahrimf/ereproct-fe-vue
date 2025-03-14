<template>
  <div class="mb-1">
    <label class="font-medium text-slate-700" :class="[size]" :for="id">{{
      label
    }}</label>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    id?: string;
    label: string;
    size?: string;
  }>(),
  {
    size: "text-sm"
  }
);
</script>
