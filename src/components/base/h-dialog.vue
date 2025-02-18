<template>
  <Transition :duration="450" name="nested">
    <div
      class="fixed w-full h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-50 flex justify-center items-center transition-side overflow-hidden outer"
      role="dialog"
      v-if="dialog"
      @click.self="closeDialog"
    >
      <div class="inner p-2">
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
.nested-enter-active,
.nested-leave-active {
  transition: all 0.2s;
}
.nested-leave-active {
  transition-delay: 0.2s;
}

.nested-enter-from,
.nested-leave-to {
  opacity: 0;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.2s ease-in-out;
}
/* delay enter of nested element */
.nested-enter-active .inner {
  transition-delay: 0.2s;
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateY(-100px);

  opacity: 0.001;
}
</style>
