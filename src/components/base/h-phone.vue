<template>
  <div>
    <div class="mb-1">
      <label class="text-sm font-medium text-slate-700" :for="id">{{
        label
      }}</label>
    </div>
    <div class="relative">
      <span
        class="text-xs absolute z-[2] py-[9px] top-[2px] left-[2px] px-2 text-primary bg-slate-100 rounded-[3px] font-medium"
      >
        +62
      </span>
      <input
        :id="id"
        ref="input"
        v-model="model"
        class="input__form"
        :placeholder="placeholder"
        autocomplete="off"
        data-testid="input"
        v-bind="$attrs"
        @beforeinput="checkOnInput"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { onMounted, ref } from "vue";

defineOptions({
  name: "InputPhoneComponent",
  inheritAttrs: false,
});

const props = defineProps<{
  id?: string;
  modelValue: string | number | undefined;
  placeholder?: string;
  label?: string;
  autofocus?: boolean;
}>();

const input = ref<HTMLInputElement | null>(null);
defineEmits<{
  (e: "update:modelValue", value: string | number): void;
  (e: "clear"): void;
}>();

const model = useVModel(props);

const checkOnInput = (event: Event) => {
  const inputEvent = event as InputEvent; // Type assertion
  if (inputEvent.data && !isNumber(inputEvent.data)) {
    inputEvent.preventDefault(); // Prevent input

    if (inputEvent.inputType === "insertFromPaste") {
      const target = inputEvent.target as HTMLInputElement;
      const oldValue = target.value;
      const value = removeUnaccepted(inputEvent.data);
      const ss = target.selectionStart!;
      const se = target.selectionEnd!;
      const nextValue = `${oldValue.slice(0, ss)}${value}${oldValue.slice(se)}`;

      try {
        target.value = nextValue;

        target.dispatchEvent(new Event("input", { bubbles: true })); // Use Event instead of InputEvent
        target.setSelectionRange(value.length + ss, value.length + ss);
      } catch (error) {
        console.error(error);
      }
    }
  }
};

const isNumber = (value: string) => {
  const numberRegex = /^-?\d*\.?\d+$/;
  return numberRegex.test(value);
};

const removeUnaccepted = (value: string) => {
  const regex = new RegExp(`[^\\d]+`, "g");
  return value.replace(regex, "");
};

const onFocused = () => {
  if (props.autofocus && input.value) input.value.focus();
};

onMounted(() => {
  onFocused();
});
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-2 pr-3 pl-[45px] text-sm bg-white relative rounded border border-solid w-full outline-none;
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
