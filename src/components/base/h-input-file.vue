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
    <div class="relative">
      <mdicon
        name="paperclip"
        size="20"
        class="-rotate-45 text-gray-500 absolute top-2.5 left-2 z-2"
        @click="!disabled ? fileInputClick() : () => {}"
      />
      <mdicon
        v-if="modelValue"
        name="close"
        size="20"
        class="text-gray-500 absolute top-2.5 right-2 cursor-pointer z-2"
        @click="resetFile"
      />
      <input
        ref="input"
        class="input__form"
        :value="filename"
        @click="fileInputClick()"
        :id="id"
        :type="type"
        readonly
        :disabled="disabled"
        :placeholder="placeholder"
      />
    </div>
    <input
      type="file"
      ref="fileRef"
      :accept="rule"
      @change="selectFile($event)"
      class="hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

defineOptions({
  name: "InputFileComponent"
});

const props = defineProps<{
  id?: string;
  type?: string;
  disabled?: boolean;
  label?: string;
  subtitle?: string;
  rule?: string;
  placeholder?: string;
  modelValue?: File | null;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", file: File | null): void;
  (e: "change", file: File | null): void;
}>();

const filename = ref<string>("");
const fileRef = ref<HTMLInputElement | null>(null);

const fileInputClick = () => {
  if (!props.disabled && fileRef.value) {
    fileRef.value.click();
  }
};

const selectFile = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const { files } = target;
  if (files && files.length > 0) {
    emit("update:modelValue", files[0]);
    emit("change", files[0]);
    filename.value = files[0].name;
  }
};

const resetFile = () => {
  emit("update:modelValue", null);
  filename.value = "";
};

watch(
  () => props.modelValue,
  (val) => {
    if (!val) {
      filename.value = "";
    }
  }
);

defineExpose({
  resetFile
});
</script>

<style lang="postcss" scoped>
.input__form {
  @apply py-2 px-[30px] text-sm bg-white relative rounded border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
  &:disabled {
    @apply border-slate-200 bg-slate-100 z-[1];
  }
}
</style>
