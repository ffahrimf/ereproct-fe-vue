<template>
  <Transition :duration="450" name="drawer">
    <div
      class="fixed w-full h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-50 flex justify-end items-center transition-side overflow-hidden outer"
      role="dialog"
      v-if="dialog"
      @click.self="closeDialog"
    >
      <div class="inner">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  dialog: boolean;
}>();

const emit = defineEmits<{
  (e: "update:dialog", value: boolean): void;
  (e: "close"): void;
}>();

const closeDialog = () => {
  emit("close");
};
</script>

<style>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.2s;
}
.drawer-leave-active {
  transition-delay: 0.2s;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .inner,
.drawer-leave-active .inner {
  transition: all 0.2s ease-in-out;
}
/* delay enter of drawer element */
.drawer-enter-active .inner {
  transition-delay: 0.2s;
}

.drawer-enter-from .inner,
.drawer-leave-to .inner {
  transform: translateX(100px);

  opacity: 0.001;
}
</style>
