<template>
  <label class="radio" :class="classNames" @click.prevent="toggle">
    <h-icon
      mode="mdi"
      :name="model ? 'radiobox-marked' : 'radiobox-blank'"
      :class="model ? 'text-blue-400' : 'text-slate-400'"
      size="22"
    ></h-icon>

    <span class="radio__label text-sm font-medium pr-5">
      <slot :is-checked="model" />
    </span>
    <input
      type="radio"
      :value="model"
      :name="name"
      :disabled="disabled || readonly"
    />
  </label>
</template>

<script setup lang="ts">
import { deepEqual } from "fast-equals";
import { computed } from "vue";

const props = defineProps<{
  name?: string;
  modelValue?: any; // Menggunakan 'any' untuk fleksibilitas
  value?: any; // Menggunakan 'any' untuk fleksibilitas
  checked?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  color?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: boolean): void;
}>();

const insertModel = (props: any) => {
  const checked = props.value;

  const models = computed({
    get() {
      return deepEqual(props.modelValue, checked) || props.checked;
    },
    set(value) {
      emit("change", value);

      if (value) emit("update:modelValue", checked);
    },
  });
  return models;
};

const model = insertModel(props);

const classNames = computed(() => {
  const result = [];

  if (props.readonly) result.push("radio--readonly");
  if (props.disabled) result.push("radio--disabled");

  return result;
});

const toggle = () => {
  if (!props.disabled && !props.readonly) model.value = true;
};
</script>

<style scoped lang="postcss">
.radio {
  @apply inline-flex space-x-2 relative cursor-pointer select-none items-center;

  /**
    * hide default appearance
    * radio
    */
  & > input[type="radio"] {
    @apply appearance-none w-0 h-0 opacity-0 absolute;
  }

  /**
    * give color of checkbox label
    */
  &__label {
    @apply text-slate-800 grow;
  }

  /**
    * disable radio
    */
  &&--disabled {
    @apply opacity-50;
  }

  /**
    * radio with appearance none
    */
  &&--none {
    .radio__icon {
      @apply hidden;

      + .radio__label {
        @apply ml-0;
      }
    }

    &.radio--disabled {
      .card {
        @apply bg-slate-500 hover:shadow-none hover:cursor-default;
      }
    }
  }
}
</style>
