<template>
  <label class="checkbox" :class="classNames" @click.prevent="toggle">
    <h-icon
      mode="mdi"
      :name="model ? 'checkbox-marked' : 'checkbox-blank-outline'"
      :class="model ? 'text-blue-400' : 'text-slate-400'"
      size="22"
    ></h-icon>
    <div
      class="w-[12px] h-[12px] absolute left-[-3px]"
      :class="animatePulse"
    ></div>
    <span
      class="checkbox__label text-sm font-medium"
      :class="$slots.default ? 'pr-5' : 'pr-1'"
    >
      <slot :is-checked="model" />
    </span>
    <input
      type="checkbox"
      :checked="model"
      :name="name"
      :disabled="disabled || readonly"
      :value="value"
    />
  </label>
</template>

<script setup lang="ts">
import { deepEqual } from "fast-equals";
import { computed, ref } from "vue";
import { syncRef } from "@vueuse/core";

const props = defineProps<{
  name?: string;
  modelValue?: any; // bisa disesuaikan dengan tipe yang tepat
  value?: any; // bisa disesuaikan dengan tipe yang tepat
  uncheckedValue?: any; // bisa disesuaikan dengan tipe yang tepat
  checked?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  color?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: boolean): void;
}>();

const isChecked = (modelValue: any, checked: any): boolean => {
  if (Array.isArray(modelValue)) return valueIn(modelValue, checked);
  return isEqual(modelValue, checked);
};

const isEqual = (a: any, b: any): boolean => {
  return deepEqual(a, b);
};

const valueIn = (array: any[], value: any): boolean => {
  return array.some((item) => isEqual(item, value));
};

const insertModel = (props: any) => {
  const localValue = ref(
    isChecked(props.modelValue, props.value) || props.checked,
  );

  const model = computed({
    get() {
      return isChecked(props.modelValue, props.value) || props.checked;
    },
    set(value: boolean) {
      const newValue = value ? props.value : props.uncheckedValue;
      if (Array.isArray(props.modelValue)) {
        if (value) {
          if (!valueIn(props.modelValue, newValue)) {
            emit("update:modelValue", [...props.modelValue, newValue]);
          }
        } else {
          emit(
            "update:modelValue",
            props.modelValue.filter((old: any) => !isEqual(old, props.value)),
          );
        }
      } else {
        emit("update:modelValue", newValue);
      }
      emit("change", value);
    },
  });

  syncRef(localValue, model, { immediate: false });
  return localValue;
};

const model = insertModel(props);

const classNames = computed(() => {
  const result: string[] = [];
  if (props.readonly) result.push("checkbox--readonly");
  if (props.disabled) result.push("checkbox--disabled");
  return result;
});

const toggle = async () => {
  if (!props.disabled && !props.readonly) {
    model.value = !model.value;
    setPulse();
  }
};

const animatePulse = ref("");

const setPulse = () => {
  if (model.value) {
    animatePulse.value = "pulser";
    setTimeout(() => {
      animatePulse.value = "";
    }, 500);
  }
};
</script>

<style scoped lang="postcss">
.checkbox {
  @apply inline-flex space-x-2 relative cursor-pointer select-none items-center;

  & > input[type="checkbox"] {
    @apply appearance-none w-0 h-0 opacity-0 absolute;
  }

  &__label {
    @apply text-slate-800 grow;
  }

  &&--disabled {
    @apply opacity-50;
  }

  &&--none {
    .checkbox__icon {
      @apply hidden;

      + .checkbox__label {
        @apply ml-0;
      }
    }

    &.checkbox--disabled {
      .card {
        @apply bg-slate-500 hover:shadow-none hover:cursor-default;
      }
    }
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}
.pulser {
  animation: ping 0.5s cubic-bezier(0, 0, 0.2, 1);
  background-color: rgb(96 165 250);
}
</style>
