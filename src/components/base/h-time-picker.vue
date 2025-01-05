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
    <div
      class="flex items-center border rounded w-max"
      :class="disabled ? 'bg-slate-50' : 'bg-white'"
    >
      <div class="p-2 bg-blue-50 rounded">
        <h-icon name="clock" class="text-primary"></h-icon>
      </div>
      <h-menu :disabled="disabled" arrow>
        <div class="px-3" @click="onOpen(time.hour, 'hour')">
          <p class="w-[25px]">{{ time.hour ?? "-" }}</p>
        </div>
        <template #item>
          <div
            v-for="i in hour_list"
            :key="`hour-${i}`"
            :id="`hour-${i}`"
            class="px-2 hover:bg-slate-100 rounded text-center cursor-pointer"
            :class="
              i == time.hour
                ? 'text-blue-500 bg-slate-50'
                : timeDisabled(i, 'hour')
                ? 'text-slate-300'
                : ''
            "
            @click="onChange(i, 'hour', timeDisabled(i, 'hour'))"
          >
            <p class="py-1">{{ i }}</p>
          </div>
        </template>
      </h-menu>
      <p>:</p>
      <h-menu :disabled="disabled" arrow>
        <div class="px-3" @click="onOpen(time.minute, 'minute')">
          <p class="w-[25px]">{{ time.minute ?? "-" }}</p>
        </div>
        <template #item>
          <div
            v-for="i in minute_list"
            class="py-1 px-2 hover:bg-slate-100 rounded text-center cursor-pointer"
            :class="
              i == time.minute
                ? 'text-blue-500 bg-slate-50'
                : timeDisabled(i, 'minute')
                ? 'text-slate-300'
                : ''
            "
            :key="`minute-${i}`"
            :id="`minute-${i}`"
            @click="onChange(i, 'minute', timeDisabled(i, 'minute'))"
          >
            {{ i }}
          </div>
        </template>
      </h-menu>
      <p class="px-3 border-l text-sm text-slate-500">WIB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import day from "../../plugins/day";
import { useVModel } from "@vueuse/core";

const hour_list = computed(() => {
  return Array.from({ length: 24 }, (_, i) => (i < 10 ? "0" + i : String(i)));
});
const minute_list = computed(() => {
  return Array.from({ length: 60 }, (_, i) => (i < 10 ? "0" + i : String(i)));
});

const props = defineProps<{
  id?: string;
  modelValue: string;
  min?: string;
  label?: string;
  subtitle?: string;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

const model = useVModel(props);

const time = computed(() => {
  if (typeof model.value === "string" && model.value.includes(":")) {
    const [hour, minute] = model.value.split(":");
    return { hour, minute };
  } else {
    return { hour: null, minute: null };
  }
});

const minTime = ref<{ hour?: number; minute?: number } | null>(null);

const setMin = (str: string) => {
  const [hour, minute] = str.split(":");
  return { hour: parseInt(hour), minute: parseInt(minute) };
  // if (str && str.includes(":")) {
  // } else {
  //   return false;
  // }
};

const timeDisabled = (i: number | string, type: "hour" | "minute") => {
  if (minTime.value) {
    return parseInt(i as string) < (minTime.value[type] ?? 0);
  }
  return false;
};

const onOpen = (val: string | null, type: "hour" | "minute") => {
  if (props.min) {
    minTime.value =
      props.min && props.min.includes(":") ? setMin(props.min) : null;
  }
  if (val) {
    setTimeout(() => {
      const el = document.getElementById(`${type}-${val}`);
      if (el) {
        el.scrollIntoView();
      }
    });
  }
};

const onChange = (
  val: string,
  type: "hour" | "minute",
  isDisabled: boolean,
) => {
  if (!isDisabled) {
    const newHour =
      type === "hour" ? val : time.value.hour ?? currentHour.value;
    const newMinute = type === "minute" ? val : time.value.minute ?? "00";

    const formatted = `${newHour}:${newMinute}`;
    emit("update:modelValue", formatted);
    emit("change", formatted);
  }
};

const currentHour = ref(day().hour());
</script>

<style scoped>
/* Add any scoped styles here if needed */
</style>
