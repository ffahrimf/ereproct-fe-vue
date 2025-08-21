<template>
  <div v-if="isVisible" :class="typeStyles.container">
    <div class="flex-shrink-0">
      <component
        :is="iconComponent"
        :class="typeStyles.icon"
        aria-hidden="true"
      />
    </div>

    <div class="ml-3 flex-1">
      <p :class="typeStyles.title" class="text-[15px] leading-tight">
        <slot name="title" />
      </p>
      <div :class="typeStyles.body" class="mt-1.5 text-[13px]">
        <slot />
      </div>
      <div v-if="$slots.actions" class="mt-4">
        <div class="-my-1.5 flex">
          <slot name="actions" />
        </div>
      </div>
    </div>

    <div v-if="dismissible" class="ml-auto pl-3">
      <div class="-mx-1.5 -my-1.5">
        <button type="button" @click="dismiss" :class="typeStyles.closeButton">
          <span class="sr-only">Dismiss</span>
          <XMarkIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from "@heroicons/vue/24/outline";

const props = defineProps({
  type: {
    type: String,
    default: "info",
    validator: (value) =>
      ["info", "success", "warning", "error"].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: true
  }
});

const isVisible = ref(true);
const dismiss = () => {
  isVisible.value = false;
};

const styles = {
  info: {
    container: " rounded-md bg-blue-50 p-4 flex",
    icon: "h-5 w-5 text-blue-400",
    title: " font-semibold font-inter ",
    body: "text-gray-700 ",
    closeButton:
      "inline-flex rounded-md bg-blue-50 p-1.5  hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-50"
  },
  success: {
    container: " rounded-md bg-green-50 p-4 flex",
    icon: "h-5 w-5 text-green-400",
    title: " font-semibold font-inter ",
    body: "text-gray-700",
    closeButton:
      "inline-flex rounded-md bg-green-50 p-1.5  hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
  },
  warning: {
    container: " rounded-md bg-yellow-50 p-4 flex",
    icon: "h-5 w-5 text-yellow-400",
    title: " font-semibold font-inter ",
    body: "text-gray-700",
    closeButton:
      "inline-flex rounded-md bg-yellow-50 p-1.5  hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
  },
  error: {
    container: " rounded-md bg-red-50 p-4 flex",
    icon: "h-5 w-5 text-red-400",
    title: " font-semibold font-inter ",
    body: "text-gray-700",
    closeButton:
      "inline-flex rounded-md bg-red-50 p-1.5  hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
  }
};

const icons = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  error: XCircleIcon
};

const typeStyles = computed(() => styles[props.type]);

const iconComponent = computed(() => icons[props.type]);
</script>
