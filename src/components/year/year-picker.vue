<template>
  <div>
    <button @click="fire" class="outline-none h-max w-max relative" ref="root">
      <slot></slot>
    </button>

    <transition>
      <div
        v-if="isOpen"
        ref="target"
        class="bg-white rounded border shadow z-50 absolute"
        :style="full ? `width: 250px;` : 'max-content'"
      >
        <div
          class="overflow-y-auto styled-scroll max-h-[300px] relative py-1 px-2 z-[51] bg-white rounded"
        >
          <div class="grid grid-cols-3 gap-1">
            <div
              v-for="i in years"
              :key="`year-${i}`"
              class="p-1.5 rounded cursor-pointer"
              :class="
                selectedYear == i
                  ? 'bg-primary text-white'
                  : 'hover:bg-slate-100'
              "
              :id="`year-${i}`"
              @click="setYear(i)"
            >
              <p class="text-center text-sm font-medium">
                {{ i }}
              </p>
            </div>
          </div>
        </div>
        <div ref="arrowEl" class="arrow border" v-if="arrow"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import day from "../../plugins/day";
import { onClickOutside } from "@vueuse/core";
import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  offset,
  shift,
  arrow as conArrow,
} from "@floating-ui/dom";

const props = defineProps<{
  id?: string;
  closeOnClick?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  modelValue?: number | null;
  full?: boolean;
  width?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number | null): void;
  (e: "change", value: number): void;
  (e: "close"): void;
}>();

const years = computed(() => {
  return Array.from({ length: 131 }, (_, index) => 1970 + index);
});

const arrowEl = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
// const parentSize = useElementSize(root);
// const targetSize = useElementSize(target);

const selectedYear = ref<number>(props.modelValue ?? day().year());

const isOpen = ref<boolean>(false);
const isHidden = ref<boolean>(false);

const fire = () => {
  if (!props.disabled) {
    isOpen.value = true;
    scrollYear();
  }
};

const setYear = (year: number) => {
  emit("update:modelValue", year);
  emit("change", year);
  selectedYear.value = year;
  closeMenu();
};

onClickOutside(target, (_event) => {
  setTimeout(() => {
    closeMenu();
  });
});

const closeMenu = () => {
  isOpen.value = false;
};

const onReset = () => {
  selectedYear.value = day().year();
};

defineExpose({
  onReset,
});

const scrollYear = () => {
  setTimeout(() => {
    let anchor = document.getElementById(`year-${selectedYear.value}`);
    anchor?.scrollIntoView({ block: "center" });
  });
};

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
          placement: "bottom",
          middleware: middleware.value,
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
                  left: x != null ? `${x}px` : "",
                });
              }
            }
          }
        });
      });

      onCleanup(cleanup);
    }
  },
  { flush: "post" },
);
</script>

<style lang="postcss" scoped>
.arrow {
  position: absolute;
  background: white;
  width: 9px;
  height: 9px;
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
  /* transform: translateY(-10px); */
}
</style>
