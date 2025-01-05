<template>
  <div>
    <div class="mb-1" v-if="label">
      <label class="text-sm font-medium text-slate-700" :for="id"
        >{{ label }}
      </label>
    </div>

    <YearPicker v-model="display" ref="picker" arrow full @change="setYear">
      <div class="h-max relative" :class="width">
        <span
          class="text-sm absolute z-[2] py-[7px] top-[2px] left-[2px] px-2 text-primary bg-slate-100 rounded-[3px]"
        >
          <h-icon name="calendar"></h-icon>
        </span>
        <input
          ref="inputRef"
          type="text"
          class="input__form"
          :class="disabled ? 'bg-slate-100' : 'bg-white'"
          :disabled="disabled"
          :placeholder="placeholder"
          @beforeinput="disableTyping($event)"
          :value="display"
        />
        <button
          v-if="modelValue"
          @click.stop="resetValue"
          class="outline-none absolute right-3 top-[9px]"
        >
          <h-icon
            name="close"
            mode="mdi"
            size="18"
            class="text-slate-500"
          ></h-icon>
        </button>
      </div>
    </YearPicker>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import YearPicker from "../year/year-picker.vue";

const props = defineProps<{
  id?: string;
  closeOnClick?: boolean;
  label?: string;
  subtitle?: string;
  placeholder?: string;
  width?: string;
  full?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  mode?: string;
  modelValue: number | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number | null): void;
  (e: "change", value: number | null): void;
  (e: "close"): void;
}>();

const disableTyping = (event: Event) => {
  event.preventDefault(); //di prevent
};

const picker = ref();

const resetValue = () => {
  emit("update:modelValue", null);
  emit("change", null);
  display.value = null;
  picker.value.onReset();
};

const display = ref<number | null>(props.modelValue ?? null);

const setYear = (year: number) => {
  emit("update:modelValue", year);
  emit("change", year);
  display.value = year;
};
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-[8px] pr-3 pl-[45px] text-sm  relative rounded border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
}
</style>
