<template>
  <div :style="styles" class="progress-container rounded-lg overflow-hidden">
    <div :style="styles" class="progress-bar"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useLighten } from "../../composables/use-theme";

const props = defineProps<{
  color?: string;
}>();

const styles = computed(() => {
  return {
    "--bg-base": props.color || "#F3B520",
    "--bg-lighten": useLighten(props.color || "#F3B520", 5),
  };
});
</script>

<style scoped lang="scss">
@keyframes progressAnimation {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-container {
  width: 100%;
  height: 4px;
  background-color: var(--bg-lighten);
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background-color: var(--bg-base);
  animation: progressAnimation 1s linear infinite;
}
</style>
