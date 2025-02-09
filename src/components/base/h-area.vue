<template>
  <div>
    <div class="flex items-center max-[768px]:block mb-1">
      <label
        class="text-xs md:text-base lg:text-xs xl:text-base text-word"
        :for="id"
        >{{ label }}</label
      >
      <p class="text-[10px] text-gray-500 italic ml-1" v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
    <textarea
      ref="input"
      v-model="model"
      class="input__form"
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

const props = defineProps<{
  id?: string;
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  row?: string;
  label?: string;
  subtitle?: string;
}>();

// const emits = defineEmits<{
//   (event: "update:modelValue", value: string | number): void;
//   (event: "clear"): void;
// }>();

const model = useVModel(props);
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-[10px] px-5 text-xs md:text-base lg:text-xs xl:text-base bg-white relative rounded-2xl border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
}
</style>
