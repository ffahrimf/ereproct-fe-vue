<template>
  <button
    class="outline-none h-max"
    :class="buttonClass"
    ref="root"
    @click="fire"
  >
    <slot :isOpen="isOpen"></slot>
  </button>
  <transition>
    <div
      v-if="isOpen"
      ref="target"
      class="z-50 rounded-3xl absolute shadow-md bg-white elevation"
      :style="full ? `width: ${parentWidth.width.value + 18}px` : 'max-content'"
    >
      <div class="pb-3" v-if="loading">
        <ProgressLinear />
      </div>
      <div class="z-[51] relative rounded-3xl bg-white" ref="menuRef">
        <div @click="isCloseOnClick()">
          <slot name="item"></slot>
        </div>
      </div>
      <div ref="arrowEl" class="arrow border" v-if="arrow"></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch } from "vue";
import { onClickOutside, useElementSize, useScroll } from "@vueuse/core";
import {
  autoUpdate,
  computePosition,
  offset,
  flip,
  shift,
  hide,
  arrow as conArrow
} from "@floating-ui/dom";
import ProgressLinear from "./progress-linear.vue";

const arrowEl = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
const parentWidth = useElementSize(root);

const menuRef = ref<HTMLElement | null>(null);
const { arrivedState } = useScroll(menuRef);
const isOpen = ref(false);
const isHidden = ref(false);

const fire = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const props = defineProps<{
  id?: string;
  closeOnClick?: boolean;
  label?: string;
  subtitle?: string;
  width?: string;
  full?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  loading?: boolean;
  buttonClass?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "bottom"): void;
}>();

const isCloseOnClick = () => {
  if (props.closeOnClick) {
    setTimeout(() => {
      closeMenu();
    });
  }
};

onClickOutside(target, (_event) => {
  setTimeout(() => {
    closeMenu();
  });
});

const closeMenu = () => {
  isOpen.value = false;
};

defineExpose({
  closeMenu
});

const middleware = ref<any[]>([]);

watchEffect(
  (onCleanup) => {
    if (isOpen.value && root.value && target.value) {
      middleware.value = [flip(), shift(), offset(props.arrow ? 8 : 5), hide()];
      if (props.arrow && arrowEl.value) {
        middleware.value.splice(2, 0, conArrow({ element: arrowEl.value }));
      }
      const cleanup = autoUpdate(root.value, target.value, () => {
        computePosition(root.value!, target.value!, {
          strategy: "absolute",
          placement: "bottom-start",
          middleware: middleware.value
        }).then(({ x, y, placement, middlewareData }) => {
          if (target.value) {
            target.value.style.left = `${x || 0}px`;
            target.value.style.top = `${y || 0}px`;
            if (middlewareData.hide) {
              isHidden.value = middlewareData.hide.referenceHidden ?? false;
            }

            if (middlewareData.arrow) {
              const { x } = middlewareData.arrow;
              const isTop = placement.indexOf("top") > -1;
              if (arrowEl.value) {
                Object.assign(arrowEl.value.style, {
                  [`${isTop ? "bottom" : "top"}`]: "-4px",
                  left: x != null ? `${x}px` : ""
                });
              }
            }
          }
        });
      });

      onCleanup(cleanup);
    }
  },
  { flush: "post" }
);

// untuk trigger infinte scroll
watch(
  () => arrivedState.bottom,
  (val) => {
    if (val === true) {
      emit("bottom");
    }
  }
);
</script>

<style scoped>
.arrow {
  position: absolute;
  background: white;
  width: 8px;
  height: 8px;
  transform: rotate(45deg);
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.v-leave-to {
  opacity: 0;
}
</style>
