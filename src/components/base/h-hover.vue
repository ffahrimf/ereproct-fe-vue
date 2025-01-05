<template>
  <div ref="root">
    <slot :hover="isHovered"></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useElementHover } from "@vueuse/core";

const root = ref<HTMLElement | null>(null);
const isHovered = useElementHover(root);
</script>
