<template>
  <div>
    <div class="flex items-center max-[768px]:block mb-1">
      <label class="text-sm font-medium text-slate-700" :for="id">{{
        label
      }}</label>
      <p class="text-[10px] text-gray-500 italic ml-1" v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>
    <DatePicker
      v-model="model"
      :popover="false"
      :min-date="min"
      :max-date="max"
      :masks="{ L: 'DD/MM/YYYY' }"
      @update:model-value="onChange"
    >
      <template v-slot="{ inputValue, togglePopover }">
        <div class="relative">
          <span
            class="text-sm absolute z-[2] py-[7px] top-[2px] left-[2px] px-2 text-primary bg-slate-100 rounded-[3px]"
            @click="handleClick(togglePopover)"
          >
            <h-icon name="calendar" :is-outline="true"></h-icon>
          </span>
          <input
            @click.self="handleClick(togglePopover)"
            ref="inputRef"
            type="text"
            class="input__form"
            :class="disabled ? 'bg-slate-100' : 'bg-white'"
            :disabled="disabled"
            :placeholder="placeholder"
            @beforeinput="disableTyping($event)"
            :value="inputValue"
          />
          <button
            class="outline-none absolute right-1 top-[9px]"
            @click="resetValue()"
            v-if="inputValue"
          >
            <h-icon
              name="close"
              mode="mdi"
              size="18"
              class="text-slate-500"
            ></h-icon>
          </button>
        </div>
      </template>
    </DatePicker>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";
import { ref } from "vue";

const inputRef = ref<HTMLInputElement | null>(null);

// Define props
const props = defineProps<{
  id?: string;
  modelValue?: Date | null; // Hanya menggunakan Date atau null
  placeholder?: string;
  label?: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  subtitle?: string;
}>();

// Define emits
const emits = defineEmits<{
  (e: "update:modelValue", value: Date | null): void; // Tipe sesuai dengan Date
  (e: "change", value: Date | null): void; // Tipe sesuai dengan Date
}>();

// Mengambil model menggunakan useVModel
const model = useVModel(props, "modelValue", emits);

// Fungsi untuk menangani perubahan nilai
const onChange = (val: Date | null) => {
  emits("change", val);
};

// Mengatur fokus input
const handleClick = (togglePopover: () => void) => {
  if (!props.disabled) {
    inputRef.value?.focus();
    togglePopover();
  }
};

// Reset nilai ke null
const resetValue = () => {
  emits("update:modelValue", null);
};

// Fungsi untuk menonaktifkan typing
const disableTyping = (event: Event) => {
  event.preventDefault(); // Mencegah input
};
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-[8px] pr-3 pl-[45px] text-sm relative rounded border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
}
</style>
