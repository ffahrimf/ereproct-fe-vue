<template>
  <div class="py-2 px-3 bg-white border border-gray-200 rounded-lg">
    <div class="w-full flex justify-between items-center gap-x-5">
      <div class="grow">
        <span class="block text-xs text-gray-500 font-medium font-dm-sans">{{
          label
        }}</span>
        <input
          class="w-full p-0 bg-transparent border-0 text-gray-800 focus:ring-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          style="-moz-appearance: textfield"
          type="number"
          :value="modelValue"
          :min="min"
          :max="max"
          @input="onInput($event)"
        />
      </div>
      <div class="flex justify-end items-center gap-x-1.5">
        <button
          type="button"
          class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="modelValue <= min"
          @click="decrease"
        >
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14" />
          </svg>
        </button>
        <button
          type="button"
          class="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-full border border-gray-200 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          :disabled="modelValue >= max"
          @click="increase"
        >
          <svg
            class="shrink-0 size-3.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: "Select quantity"
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: Infinity
  },
  step: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(["update:modelValue"]);

const increase = () => {
  const newValue = Math.min(props.modelValue + props.step, props.max);
  emit("update:modelValue", newValue);
};

const decrease = () => {
  const newValue = Math.max(props.modelValue - props.step, props.min);
  emit("update:modelValue", newValue);
};

const onInput = (e: Event) => {
  const val = Number((e.target as HTMLInputElement).value);
  if (!isNaN(val)) {
    emit("update:modelValue", val);
  }
};
</script>
