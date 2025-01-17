<template>
  <div class="w-full">
    <div
      :class="`grid overflow-hidden transition-all duration-300 ease-in-out text-slate-500
        ${
          props.isOpen
            ? 'grid-rows-[1fr] opacity-100'
            : 'grid-rows-[0fr] opacity-0'
        }
      `"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["isOpen"]);
</script>
