<template>
  <div>
    <div class="mb-1" v-if="label">
      <label class="text-sm font-medium text-slate-700" :for="id"
        >{{ label }}
      </label>
    </div>
    <button @click="fire" class="outline-none h-max w-max relative" ref="root">
      <div class="h-max relative" :class="width">
        <span
          class="text-sm absolute z-[2] py-[7px] top-[2px] left-[2px] px-2 text-primary bg-slate-100 rounded-[3px]"
        >
          <h-icon name="calendar"></h-icon>
        </span>
        <input
          ref="inputRef"
          type="text"
          class="input__form"
          :class="disabled ? 'bg-slate-100' : 'bg-white'"
          :disabled="disabled"
          :placeholder="placeholder"
          @beforeinput="disableTyping($event)"
          :value="display"
        />
        <button
          v-if="modelValue"
          @click.stop="resetValue"
          class="outline-none absolute right-3 top-[9px]"
        >
          <h-icon
            name="close"
            mode="mdi"
            size="18"
            class="text-slate-500"
          ></h-icon>
        </button>
      </div>
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
              v-for="i in 12"
              :key="`month-${i}`"
              class="py-2 px-4 rounded cursor-pointer"
              :class="
                selectedMonth == i
                  ? 'bg-primary text-white'
                  : 'hover:bg-slate-100'
              "
              @click="setMonth(i)"
            >
              <p class="text-center text-sm font-medium">
                {{
                  day()
                    .month(i - 1)
                    .locale("id")
                    .format("MMM")
                }}
              </p>
            </div>
          </div>
        </div>
        <div ref="arrowEl" class="arrow border"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
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
  label?: string;
  subtitle?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: number | null): void;
  (e: "change", value: number): void;
  (e: "close"): void;
}>();

const arrowEl = ref<HTMLElement | null>(null);
const target = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);

const fmtMonth = (m: number) => day().month(m).locale("id").format("MMMM");
const selectedMonth = ref<number | null | undefined>(props.modelValue);

const display = ref<string | null>(
  props.modelValue ? fmtMonth(props.modelValue - 1) : null,
);

const isOpen = ref<boolean>(false);
const isHidden = ref<boolean>(false);

const disableTyping = (event: Event) => {
  event.preventDefault(); //di prevent
};

const fire = () => {
  if (!props.disabled) {
    isOpen.value = true;
  }
};

const setMonth = (month: number) => {
  emit("update:modelValue", month);
  emit("change", month);
  selectedMonth.value = month;
  console.log(month);

  display.value = fmtMonth(month - 1);
  closeMenu();
};

const resetValue = () => {
  emit("update:modelValue", null);
  display.value = null;
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
  selectedMonth.value = day().month();
};

defineExpose({
  onReset,
});

const middleware = ref<any[]>([]);
watchEffect(
  (onCleanup) => {
    if (isOpen.value && root.value && target.value) {
      middleware.value = [flip(), shift(), offset(8), hide()];
      if (arrowEl.value) {
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
.input__form {
  @apply py-[8px] pr-3 pl-[45px] text-sm  relative rounded border border-solid w-full outline-none;
  &:focus {
    @apply border-slate-200 ring-2 ring-slate-300/20 z-[1];
  }
}
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
