<template>
  <div class="relative">
    <h-icon
      name="magnify"
      mode="mdi"
      size="18"
      class="absolute z-2 text-slate-500 top-2.5 left-2"
    ></h-icon>
    <input
      type="text"
      :class="['input__form', customCss, size]"
      ref="input"
      v-model="model"
      :placeholder="placeholder"
      data-testid="input"
      @keyup="searchDebounce"
    />
    <button
      class="outline-none absolute top-2.5 right-2 z-2"
      @click="emit('update:modelValue', ''), emit('search')"
      v-if="model"
    >
      <h-icon name="close" mode="mdi" size="18" class="text-slate-500"></h-icon>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useDebounceFn, useVModel } from "@vueuse/core";

defineOptions({
  name: "SearchComponents"
});

// `defineProps` diubah menggunakan `withDefaults`
const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: string;
    accept?: string;
    placeholder?: string;
    customCss?: string;
    label?: string;
    // Props baru untuk custom text size
    size?: string;
  }>(),
  {
    // Nilai default untuk semua props
    id: undefined,
    modelValue: "",
    accept: undefined,
    placeholder: "Cari...",
    customCss: "",
    label: undefined,
    size: "text-sm" // Default size
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "clear"): void;
  (e: "search"): void;
  (e: "keyup"): void;
}>();

const debouncedFn = useDebounceFn(
  () => {
    emit("search");
  },
  500,
  { maxWait: 5000 }
);

const searchDebounce = () => {
  debouncedFn();
  emit("keyup");
};
const model = useVModel(props);
</script>

<style lang="postcss" scoped>
/* ... (class lainnya tetap sama) ... */
.btn-search {
  @apply text-white font-medium text-sm bg-primary py-[8px] px-2 ml-2 h-max flex items-center outline-none border border-primary;
  &:hover {
    @apply bg-opacity-90;
  }
  &:active {
    @apply brightness-90;
  }
}
.input-search {
  @apply px-2 text-sm bg-slate-50 relative w-full flex-1 outline-none transition-all duration-200;
  &:focus {
    @apply bg-white;
  }
}

.input__form {
  /* `text-sm` dihapus dari sini karena di-handle oleh props `size` */
  @apply py-2 px-8 bg-white relative rounded-lg border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
  &:hover {
    @apply border-blue-100 ring-2 ring-blue-300/20 z-[1];
  }
  &:disabled {
    @apply bg-slate-100;
  }
}
</style>
