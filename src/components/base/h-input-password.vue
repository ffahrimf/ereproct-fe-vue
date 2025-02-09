<template>
  <div class="relative">
    <div class="mb-1">
      <label
        class="text-xs md:text-base lg:text-xs xl:text-base text-word"
        :for="id"
        >{{ label }}</label
      >
    </div>
    <div class="relative">
      <input
        ref="input"
        v-model="model"
        :type="show ? 'text' : 'password'"
        class="input__form"
        :placeholder="placeholder"
        data-testid="input"
        v-bind="$attrs"
        @beforeinput="checkOnInput(accept, $event)"
      />
      <button
        class="z-2 outline-none absolute right-2 top-2.5"
        type="button"
        @click="show = !show"
      >
        <h-icon :name="show ? 'eye-slash' : 'eye'" class="text-primary" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { ref } from "vue";

defineOptions({
  name: "InputComponent",
  inheritAttrs: false
});

interface PropsIF {
  id?: string;
  modelValue?: any | undefined;
  accept?: string | undefined;
  placeholder?: string | undefined;
  label?: string | undefined;
  subtitle?: string | undefined;
  unit?: string | undefined;
  autofocus?: boolean | undefined;
}

const props: PropsIF = defineProps({
  id: { type: String, default: "id" },
  modelValue: {
    type: [String, Number],
    default: undefined
  },
  accept: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  subtitle: {
    type: String,
    default: ""
  },
  unit: {
    type: String,
    default: ""
  },
  autofocus: Boolean
});

const emits = defineEmits(["update:modelValue", "clear"]);

const model = useVModel(props);

const show = ref(false);

const checkOnInput = (type: string | undefined, event: any) => {
  // jika tidak ada type berarti text
  if (!type || type === "text") return true;

  // jika bukan number, maka
  if (event.data && !isNumber(event.data)) {
    event.preventDefault(); // di prevent

    if (event.inputType === "insertFromPaste") {
      const target = event.target as HTMLInputElement;
      const oldValue = target.value;
      const value = removeUnaccepted(event.data);
      const ss = target.selectionStart ?? 0;
      const se = target.selectionEnd ?? 0;
      const nextValue = `${oldValue.slice(0, ss)}${value}${oldValue.slice(se)}`;

      try {
        target.value = nextValue;

        target.dispatchEvent(new InputEvent("input"));
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
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-3 px-5 text-xs md:text-base lg:text-xs xl:text-base bg-white relative rounded-3xl border border-solid w-full outline-none;
  &:focus {
    @apply border-blue-200 ring-2 ring-blue-300/10 z-[1];
  }
}
</style>
