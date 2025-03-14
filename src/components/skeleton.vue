<template>
  <div
    :class="['flex', wFull ? 'w-full' : '', `space-x-${spaceX}`]"
    :style="{ width: wFull ? '' : `${width}px` }"
  >
    <div
      v-for="i in col"
      :key="i"
      class="skeleton-loader rounded-lg w-full"
      :style="{ height: `${height}px` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    default: 0
  },
  wFull: {
    type: Boolean,
    default: false
  },
  col: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    default: 80
  },
  spaceX: {
    type: Number,
    default: 5
  }
});
</script>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-loader {
  background-color: #e5e7eb;
  background-image: linear-gradient(
    90deg,
    rgba(242, 244, 247, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(242, 244, 247, 0) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 3s infinite linear;
  animation-timing-function: ease-out;
}
</style>
