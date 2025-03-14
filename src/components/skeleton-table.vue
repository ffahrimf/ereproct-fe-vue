<template>
  <tr v-for="i in 3" :key="`th-${i}`">
    <td
      v-for="j in col"
      :key="`tr-${j}`"
      class="py-1 px-3"
      :class="i == 1 ? 'pt-3' : i == 3 ? 'pb-3' : ''"
    >
      <div class="p-3 skeleton-loader rounded-lg"></div>
    </td>
  </tr>
</template>
<script lang="ts" setup>
defineProps({
  col: Number
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
