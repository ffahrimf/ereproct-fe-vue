<template>
  <button
    class="rounded-full p-[6px] transition duration-150 ease-in-out outline-none h-max"
    :class="css"
  >
    <h-icon :name="icon" :color="color" :size="size" :mode="mode" />
  </button>
</template>

<script setup lang="ts">
interface PropsIF {
  color?: string;
  mode?: string;
  size?: string;
  css?: string;
  icon: string | undefined;
}
withDefaults(defineProps<PropsIF>(), {
  color: "text-primary",
  mode: "heroicons",
  size: "20",
  css: "hover:bg-primary/20 active:bg-primary/50",
  icon: undefined,
});
</script>

<style></style>
