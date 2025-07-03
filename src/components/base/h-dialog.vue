<template>
  <Transition :duration="450" name="nested">
    <div
      class="fixed w-full h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-50 flex justify-center items-center transition-side overflow-hidden outer"
      role="dialog"
      v-if="dialog"
      @click.self="handleOverlayClick"
    >
      <div class="inner p-2">
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
// --- BAGIAN INI DIUBAH ---

// 1. Gunakan 'withDefaults' untuk memberi nilai default pada props berbasis tipe
const props = withDefaults(
  defineProps<{
    dialog: boolean;
    persistent?: boolean; // Jadikan opsional dengan '?'
  }>(),
  {
    persistent: false // Nilai defaultnya di sini
  }
);

const emit = defineEmits<{
  (e: "close"): void;
}>();

// 2. Fungsi ini sekarang yang dipanggil oleh overlay
const handleOverlayClick = () => {
  // Cuma emit 'close' kalo dialognya GAK persistent
  // 'props.persistent' sekarang bisa diakses dengan benar
  if (!props.persistent) {
    emit("close");
  }
};

// Fungsi closeDialog yang lama sudah tidak diperlukan karena logikanya ada di handleOverlayClick
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
