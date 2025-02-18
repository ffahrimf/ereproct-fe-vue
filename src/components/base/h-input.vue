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
    <div class="flex items-center">
      <input
        :id="id"
        ref="input"
        v-model="model"
        class="input__form"
        :placeholder="placeholder"
        autocomplete="off"
        data-testid="input"
        v-bind="$attrs"
        @beforeinput="checkOnInput(accept, $event)"
      />
      <p class="ml-2 font-medium" v-if="unit">{{ unit }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useVModel } from "@vueuse/core";
import { onMounted, ref } from "vue";

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

const input = ref();
const emits = defineEmits(["update:modelValue", "clear"]);

const model = useVModel(props);

const checkOnInput = (type: string, event: any): any => {
  // kalo ga ada type berarti text
  if (!type || type == "text") return true;

  // else check bukan number maka
  if (event.data && !isNumber(event.data)) {
    event.preventDefault(); //di prevent

    if (event.inputType == "insertFromPaste") {
      const target = event.target;
      const oldValue = target.value;
      const value = removeUnaccepted(event.data);
      const ss = target.selectionStart;
      const se = target.selectionEnd;
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

const isNumber = (value: string): boolean => {
  const numberRegex = /^-?\d*\.?\d*$/;
  return numberRegex.test(value);
};

const removeUnaccepted = (value: string): string => {
  const regex = new RegExp(`[^\\d.]`, "g");
  return value.replace(regex, "");
};

const onFocused = (): void => {
  if (props.autofocus) input.value.focus();
};

onMounted(() => {
  onFocused();
});
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-2 px-3 text-sm bg-white relative rounded border border-solid w-full outline-none;
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
