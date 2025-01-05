<template>
  <div class="toast" ref="root" v-element-hover="onHover" :class="classNames">
    <div class="toast__icon">
      <component :is="solid[icon as keyof typeof solid]" class="w-6" />
    </div>
    <div class="toast__body">
      <div class="toast__title">{{ title }}</div>
    </div>
    <div
      data-testid="toast-close"
      class="toast__close"
      @click="emit('dismissed')"
    >
      <component :is="solid['XMarkIcon']" class="w-5 text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from "vue";
import * as solid from "@heroicons/vue/24/solid";
import { vElementHover } from "@vueuse/components";

const emit = defineEmits(["dismissed"]);

const props = defineProps({
  variant: String,
  title: String,
  icon: { type: String, default: "ExclamationCircleIcon" },
  type: String,
  duration: {
    type: Number,
    default: 6000,
  },
});

const root = ref<HTMLElement | null>(null);
const isHovered = ref<boolean>(false);

const timeout = ref<ReturnType<typeof setTimeout> | null>(null);

const onHover = (state: boolean) => {
  isHovered.value = state;
  if (state) {
    if (timeout.value) {
      clearInterval(timeout.value);
    }
  } else {
    startCount();
  }
};

const countdown = ref<number>(props.duration ? props.duration / 1000 : 0);

const classNames = computed(() => {
  const result = ["toast"];

  if (props.type) result.push(`toast--${props.type}`);
  if (props.variant) result.push(`toast--${props.variant}`);

  return result;
});

onMounted(() => {
  countdown.value = props.duration ? props.duration / 1000 : 0;
  startCount();
});

const startCount = () => {
  if (Number.isFinite(props.duration) && props.duration > 0) {
    timeout.value = setInterval(() => {
      countdown.value--;
      if (countdown.value <= 0) {
        emit("dismissed");
      }
    }, 1000);
  }
};

onUnmounted(() => {
  if (timeout.value) clearTimeout(timeout.value);
});
</script>

<style lang="postcss">
.toast {
  /**
      * global style
      * of toast
      */
  @apply flex shadow-xl rounded-md w-72 md:w-96 overflow-hidden;

  .toast__icon,
  .toast__close {
    @apply shrink-0 p-4;
  }

  .toast__icon {
    @apply flex items-center justify-center;
  }

  .toast__close {
    @apply cursor-pointer text-slate-800/50 hover:text-slate-800/50;
    @apply dark:text-slate-800/30;
  }

  .toast__body {
    @apply py-4 pr-4 grow space-y-2 flex flex-col;
  }

  .toast__title {
    @apply text-sm font-medium leading-[1.75];
  }

  .toast__text {
    @apply text-xs;
  }

  /**
      * Give padding-left when
      * toast variant is not filled
      */
  &:not(.toast--filled) {
    .toast__body {
      @apply pl-4;
    }
  }

  /**
      * set toast info title
      * and text color
      */
  &:is(.toast--info) {
    .toast__title {
      @apply text-slate-600;
    }

    .toast__text {
      @apply text-slate-600;
    }
  }

  /**
      * set toast info icon color.
      * provide background when
      * variant is filled
      */
  &&--info {
    &:is(.toast--simple) {
      .toast__icon {
        @apply bg-blue-800 text-white;
      }
      .toast__title {
        @apply text-blue-800;
      }
    }
    &.toast--filled {
      @apply bg-blue-800 text-white;
    }
  }

  /**
      * provide title color
      * in simple variant.
      * set toast icon color and background.
      * provide background color when
      * variant is filled
      */
  &&--error {
    &.toast--simple {
      .toast__title {
        @apply text-red-500;
      }
    }

    .toast__icon,
    &.toast--filled {
      @apply bg-red-500;
    }
  }

  &&--success {
    &.toast--simple {
      .toast__title {
        @apply text-green-500;
      }
    }

    .toast__icon,
    &.toast--filled {
      @apply bg-green-500;
    }
  }

  &&--warning {
    &.toast--simple {
      .toast__title {
        @apply text-orange-500;
      }
    }

    .toast__icon,
    &.toast--filled {
      @apply bg-orange-500;
    }
  }

  /**
      * set global style
      * of toast in simple
      * variant
      */
  &&--simple {
    @apply bg-white;

    .toast__text {
      @apply text-slate-800;
    }

    &:not(.toast--info) {
      .toast__icon {
        @apply text-white;
      }
    }
  }

  /**
      * aligning toast icon
      * when variant is filled.
      * provide text color
      * when toast color isn't info
      */
  &&--filled {
    .toast__icon {
      @apply items-start;
    }

    &:not(.toast--info) {
      @apply text-white;
    }
  }
}
</style>
