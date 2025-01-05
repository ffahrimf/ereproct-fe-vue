<template>
  <div>
    <div v-if="label">
      <label class="text-sm font-medium text-slate-700" :for="id">{{
        label
      }}</label>
    </div>
    <div class="flex items-center">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  id?: string;
  label?: string;
}>();
</script>
