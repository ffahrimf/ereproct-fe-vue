<template>
  <div ref="root" class="h-max">
    <slot></slot>
  </div>
  <transition>
    <div
      v-if="isHovered && !disabled"
      ref="target"
      :class="`z-50 rounded absolute shadow bg-white border-gray-200 ${width}`"
    >
      <div class="z-[51] relative bg-white px-3 py-1 rounded">
        <slot name="content" v-if="$slots.content"></slot>
        <p :class="contentClass">
          {{ content }}
        </p>
      </div>
      <div
        ref="arrowEl"
        class="arrow border-gray-200 shadow"
        v-if="arrow"
      ></div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  autoUpdate,
  computePosition,
  offset,
  flip,
  shift,
  hide,
  arrow as conArrow
} from "@floating-ui/dom";
import { useElementHover } from "@vueuse/core";

const root = ref<HTMLElement | null>(null); //komponen root atau pemanggil
const target = ref<HTMLElement | null>(null); //komponen yang dipanggil
const arrowEl = ref<HTMLElement | null>(null); //komponen arrow
const isHovered = useElementHover(root); //untuk cek lagi dihover atau tidak

const isHidden = ref<boolean>(false); //ini lupa untuk apa

const props = defineProps<{
  id?: string;
  width?: string;
  arrow?: boolean;
  disabled?: boolean;
  content?: string;
  contentClass?: string;
  position?: Placement;
}>();

defineEmits<{
  (e: "close"): void;
}>();

const middleware = ref<any[]>([]);
type Placement = "top" | "bottom" | "left" | "right";

watchEffect(
  (onCleanup) => {
    if (isHovered.value && root.value && target.value) {
      middleware.value = [flip(), offset(props.arrow ? 8 : 5), hide(), shift()];
      if (props.arrow && arrowEl.value) {
        middleware.value.push(conArrow({ element: arrowEl.value }));
      }
      const cleanup = autoUpdate(root.value, target.value, () => {
        if (root.value && target.value && props.position) {
          computePosition(root.value, target.value, {
            strategy: "absolute",
            placement: props.position,
            middleware: middleware.value
          }).then(({ x, y, placement, middlewareData }) => {
            if (target.value) {
              target.value.style.left = `${x || 0}px`;
              target.value.style.top = `${y || 0}px`;

              isHidden.value = !!middlewareData?.hide?.referenceHidden;

              if (middlewareData.arrow) {
                const { x: arrowX, y: arrowY } = middlewareData.arrow;
                const isTop = placement.indexOf("top") > -1;
                const isLeft = placement.indexOf("left") > -1;
                const obj: Record<string, string> = {};
                if (arrowX) {
                  // kalo x ada udah placement itu top/bottom
                  obj[`${isTop ? "bottom" : "top"}`] = "-4px";
                  obj.left = `${arrowX}px`;
                } else {
                  // sebaliknya
                  obj.top = `${arrowY}px`;
                  obj[`${isLeft ? "right" : "left"}`] = "-4px";
                }

                Object.assign(arrowEl.value!.style, obj);
              }
            }
          });
        }
      });

      onCleanup(cleanup);
    }
  },
  { flush: "post" }
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
  /* transform: translateY(-10px); */
}
</style>
