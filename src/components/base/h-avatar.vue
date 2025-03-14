<template>
  <div :style="`width: ${size}px; height: ${size}px`">
    <img
      :class="`${square ? '' : 'rounded-full'} object-cover`"
      :src="src ? src : defaultImg"
      alt="avatar himpsi"
      :style="`width: ${size}px; height: ${size}px`"
      loading="lazy"
    />
  </div>
</template>

<script setup lang="ts">
import defaultImg from "../../assets/img/avatar_default.png";

defineProps<{
  src?: string;
  size?: string;
  square?: boolean;
  lazy?: boolean;
}>();
</script>
