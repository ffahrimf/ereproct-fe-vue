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
    <button
      :class="`p-2 flex items-center justify-between rounded outline-none cursor-pointer ${
        disabled ? 'bg-slate-100' : 'bg-white'
      } ${border ? 'border border-gray-200' : ''} ${width}`"
      ref="root"
      @click="showOption"
    >
      <div class="flex-1">
        <p
          class="text-left"
          v-if="
            modelValue !== null && modelValue !== undefined && modelValue !== ''
          "
          :class="sizeValue"
        >
          {{ setName }}
        </p>
        <p class="text-left text-gray-400" :class="sizeValue" v-else>
          {{ placeholder }}
        </p>
      </div>
      <h-icon
        v-if="
          modelValue !== null &&
          modelValue !== undefined &&
          modelValue !== '' &&
          clearable
        "
        name="close"
        mode="mdi"
        class="transition-all duration-100 text-slate-500"
        @click="emit('update:modelValue', '')"
      ></h-icon>
      <h-icon
        name="chevron-down"
        mode="mdi"
        class="transition-all duration-100 text-slate-500"
        :class="isOpen ? 'rotate-180' : 'rotate-0'"
      ></h-icon>
    </button>
    <transition>
      <div
        v-if="isOpen"
        ref="target"
        class="z-20 p-1 rounded absolute shadow-lg border bg-white border-gray-200"
        :style="
          full ? `width: ${parentWidth.width.value + 18}px` : 'max-content'
        "
      >
        <slot name="search"></slot>

        <div class="pb-3" v-if="loading">
          <ProgressLinear />
          <p
            class="text-sm text-center text-slate-500 mt-1"
            v-if="!items?.length"
          >
            Loading...
          </p>
        </div>

        <div
          v-if="items?.length"
          class="max-h-[200px] overflow-y-auto styled-scroll"
          ref="menuRef"
        >
          <div
            v-for="item in items"
            class="mb-2 hover:bg-gray-100 p-2 rounded text-sm cursor-pointer last:mb-0"
            @click="selectItem(item)"
          >
            <p>{{ itemName ? item[itemName] : item }}</p>
          </div>
        </div>
        <div
          class="text-sm text-center text-slate-500"
          v-if="!items?.length && !loading && !isErr"
        >
          {{ emptyLabel }}
        </div>
        <div
          class="px-3 py-1 bg-yellow-50 border border-yellow-500 flex items-center justify-center rounded"
          v-if="isErr && !loading"
        >
          <h-icon
            name="alert-circle"
            class="text-yellow-500"
            mode="mdi"
            size="18"
          ></h-icon>
          <p class="text-sm text-center text-slate-700 ml-1">
            Gagal mengambil data
            <span
              class="font-bold text-blue-500 underline cursor-pointer"
              @click="emit('refetch')"
              >Coba Lagi</span
            >
          </p>
        </div>
        <slot name="action" :closeMenu="closeMenu"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect, watch } from "vue";
import { onClickOutside, useElementSize, useScroll } from "@vueuse/core";
import {
  autoUpdate,
  computePosition,
  offset,
  flip,
  shift,
  hide,
} from "@floating-ui/dom";
import ProgressLinear from "./progress-linear.vue";

const target = ref<HTMLElement | null>(null);
const root = ref<HTMLElement | null>(null);
const parentWidth = useElementSize(root);

const menuRef = ref<HTMLElement | null>(null);
const { arrivedState } = useScroll(menuRef);
const isOpen = ref(false);
const isHidden = ref(false);

interface PropsIF {
  modelValue: any;
  id?: string;
  closeOnClick?: boolean;
  label?: string;
  subtitle?: string;
  full?: boolean;
  items?: Array<any> | undefined;
  itemName?: string;
  itemValue?: string;
  placeholder?: string;
  emptyLabel?: string;
  loading?: boolean;
  clearable?: boolean;
  isErr?: boolean;
  errMsg?: any;
  disabled?: boolean;
  width?: string;
  border?: boolean;
  returnObject?: boolean;
  sizeValue?: string;
}

const props = withDefaults(defineProps<PropsIF>(), {
  modelValue: null,
  id: "id",
  closeOnClick: true,
  label: undefined,
  subtitle: undefined,
  full: true,
  items: undefined,
  itemName: undefined,
  itemValue: undefined,
  placeholder: "- Pilih -",
  emptyLabel: "Tidak Ada Data",
  loading: false,
  clearable: false,
  isErr: false,
  errMsg: null,
  disabled: false,
  width: "w-full",
  border: true,
  returnObject: false,
  sizeValue: "text-sm",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "close"): void;
  (e: "change", item: any): void;
  (e: "refetch"): void;
  (e: "bottom"): void;
}>();

const showOption = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const setName = computed(() => {
  let name = "";
  if (props.items != undefined) {
    if (
      props.itemName != undefined &&
      props.itemName != null &&
      props.itemValue != undefined &&
      props.itemValue != null
    ) {
      if (props.returnObject) {
        name = props.modelValue[props.itemName];
      } else {
        const isExist = props.items.find(
          (el: any) =>
            el[props.itemValue as keyof typeof el] == props.modelValue,
        );
        if (isExist) {
          name = isExist[props.itemName];
        }
      }
    } else {
      name = props.modelValue;
    }
  }

  return name;
});

const isCloseOnClick = () => {
  if (props.closeOnClick) {
    setTimeout(() => {
      closeMenu();
    });
  }
};

onClickOutside(target, () => {
  setTimeout(() => {
    closeMenu();
  });
});

const closeMenu = () => {
  isOpen.value = false;
};

defineExpose({
  closeMenu,
});

// untuk trigger infinite scroll
watch(
  () => arrivedState.bottom,
  (val) => {
    if (val === true) {
      emit("bottom");
    }
  },
);

watchEffect(
  (onCleanup) => {
    if (isOpen.value && root.value && target.value) {
      const cleanup = autoUpdate(root.value, target.value, () => {
        computePosition(root.value!, target.value!, {
          strategy: "absolute",
          placement: "bottom-start",
          middleware: [flip(), shift(), offset(5), hide()],
        }).then(({ x, y, middlewareData }) => {
          if (target.value) {
            target.value.style.left = `${x || 0}px`;
            target.value.style.top = `${y || 0}px`;
            if (middlewareData.hide) {
              isHidden.value = middlewareData.hide.referenceHidden ?? false;
            }
          }
        });
      });

      onCleanup(cleanup);
    }
  },
  { flush: "post" },
);

const selectItem = (item: any) => {
  isCloseOnClick();
  let value: any = null;
  if (props.returnObject) {
    value = item;
  } else if (props.itemValue) {
    value = item[props.itemValue];
  } else {
    value = item;
  }
  setTimeout(() => {
    emit("update:modelValue", value); //kasih set timeout biar ilangnya si items bareng dengan masuknya value
    emit("change", item);
  }, 100);
};
</script>

<style scoped>
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
