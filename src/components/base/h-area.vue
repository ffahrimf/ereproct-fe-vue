<template>
  <div>
    <div class="flex items-center max-[768px]:block mb-1">
      <label :class="['font-medium text-slate-700', labelSize]" :for="id">{{
        label
      }}</label>
      <p v-if="subtitle" :class="['text-gray-500 italic ml-1', subtitleSize]">
        {{ subtitle }}
      </p>
    </div>
    <textarea
      ref="input"
      v-model="model"
      :class="['input__form', inputSize]"
      :placeholder="placeholder"
      v-bind="$attrs"
      :rows="row"
    />
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";

defineOptions({
  name: "InputComponent",
  inheritAttrs: false
});

// `defineProps` diubah menggunakan `withDefaults` untuk ngasih nilai default
const props = withDefaults(
  defineProps<{
    id?: string;
    modelValue?: string | number;
    type?: string;
    placeholder?: string;
    row?: string;
    label?: string;
    subtitle?: string;
    // Props baru untuk custom text size
    labelSize?: string;
    subtitleSize?: string;
    inputSize?: string;
  }>(),
  {
    // Nilai default buat props text size
    id: undefined,
    modelValue: "",
    type: "text",
    placeholder: "",
    row: "4",
    label: "",
    subtitle: "",
    labelSize: "text-sm",
    subtitleSize: "text-[10px]",
    inputSize: "text-sm"
  }
);

const model = useVModel(props);
</script>

<style lang="postcss" scoped>
.input__form {
  /* `text-sm` dihapus dari sini karena udah di-handle sama props */
  @apply py-[10px] px-3 bg-white relative rounded border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
}
</style>
