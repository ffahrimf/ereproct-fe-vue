<template>
  <transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0 ease-in-out"
    enter-active-class="transition ease-in-out duration-300"
    leave-active-class="transition ease-in-out duration-300"
  >
    <div
      class="fixed w-screen h-screen inset-0 bg-gray-600 bg-opacity-50 top-0 left-0 z-50 flex justify-center items-center"
      role="dialog"
      v-if="dialog"
      @click.self="onCancel"
    >
      <div
        class="bg-white p-5 rounded shadow flex items-center justify-center flex-col max-[650px]:w-[95%]"
        :class="`${context?.width ?? 'w-[30em]'}`"
      >
        <div
          class="w-[90px] h-[90px] rounded-full flex items-center justify-center mb-1"
          :class="iconClass(context?.type ?? '')"
        >
          <component :is="solid[icon]" class="w-[70px] icon" />
        </div>
        <p class="font-medium text-[22px] text-center mb-1 leading-7">
          {{ context?.title }}
        </p>
        <p class="mb-3 text-center">
          {{ context?.text }}
        </p>
        <div class="flex items-center justify-center">
          <template v-if="context?.isConfirm">
            <h-btn
              class="min-w-[80px] py-3 px-5 mx-1.5 border-2"
              bg="bg-white"
              color="text-slate-700"
              @click="onCancel"
              >{{ context.cancelLabel ?? "Cancel" }}</h-btn
            >
            <h-btn
              class="min-w-[80px] py-3 px-5 mx-1.5 border-2 border-primary"
              @click="onConfirm"
              >{{ context.confirmLabel ?? "Ok" }}</h-btn
            >
          </template>
          <h-btn class="px-5 py-2" v-else @click="onConfirm">{{
            context?.confirmLabel ?? "Ok"
          }}</h-btn>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { nextTick, ref } from "vue";
import * as solid from "@heroicons/vue/24/solid";
import hBtn from "../../base/h-btn.vue";

interface DialogContext {
  title: string;
  text: string;
  type?: string;
  width?: string;
  isConfirm?: boolean;
  cancelLabel?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}
type IconType =
  | "CheckCircleIcon"
  | "ExclamationCircleIcon"
  | "ExclamationTriangleIcon";

const id = ref<symbol>();
const dialog = ref<boolean>(false);
const context = ref<DialogContext | null>(null);
const icon = ref<IconType>("ExclamationCircleIcon");

const show = async (opt: DialogContext) => {
  opt.type = opt.type ?? "info";
  id.value = Symbol("DialogId");
  icon.value = setIcon(opt.type);
  context.value = opt;
  nextTick(() => {
    dialog.value = true;
  });
};

defineExpose({
  show,
});

const hide = () => {
  dialog.value = false;
};

const onConfirm = () => {
  hide();
  setTimeout(() => {
    context.value?.onConfirm?.();
  }, 150);
};

const onCancel = () => {
  hide();
  setTimeout(() => {
    context.value?.onCancel?.();
  }, 150);
};

const iconClass = (type: string): string => {
  let className = "";
  switch (type) {
    case "success":
      className = "text-green-500 bg-green-100";
      break;
    case "warning":
      className = "text-yellow-500 bg-yellow-100";
      break;
    case "error":
      className = "text-red-500 bg-red-100";
      break;
    default:
      className = "text-blue-500 bg-blue-100";
      break;
  }
  return className;
};

const setIcon = (type: string): IconType => {
  switch (type) {
    case "success":
      return "CheckCircleIcon";
    case "warning":
      return "ExclamationCircleIcon";
    case "error":
      return "ExclamationTriangleIcon";
    default:
      return "ExclamationCircleIcon";
  }
};
</script>

<style scoped>
@keyframes swing {
  20% {
    transform: rotate3d(0, 0, 1, 15deg);
  }

  40% {
    transform: rotate3d(0, 0, 1, -10deg);
  }

  60% {
    transform: rotate3d(0, 0, 1, 5deg);
  }

  80% {
    transform: rotate3d(0, 0, 1, -5deg);
  }

  to {
    transform: rotate3d(0, 0, 1, 0deg);
  }
}

.icon {
  animation: swing 1s ease-in-out;
}
</style>
