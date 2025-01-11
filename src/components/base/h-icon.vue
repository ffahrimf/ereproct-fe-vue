<template>
  <div>
    <mdicon
      v-if="mode == 'mdi'"
      :name="name"
      :class="classNames"
      :size="size"
    />
    <component
      v-else
      :is="icon"
      :class="classNames"
      :style="`width: ${size}px`"
    />
  </div>
</template>

<script setup lang="ts">
import * as solid from "@heroicons/vue/24/solid";
import * as outline from "@heroicons/vue/24/outline";
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "" },
  size: { type: String, default: "20" },
  color: { type: String, default: "" },
  mode: { type: String, default: "heroicons" },
  outline: Boolean
});

const formattedIcon = () => {
  const inputStr = props.name?.replace("heroicons:", "") || "";
  const words = inputStr.split("-");
  const pascalCaseStr = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
  return (pascalCaseStr + "Icon") as keyof typeof outline;
};
const icon = computed(() => {
  const typeIcon = props.outline ? outline : solid;
  return typeIcon[formattedIcon()];
});

const classNames = computed(() => {
  const result: string[] = [];
  if (props.color) result.push(props.color);

  return result;
});
</script>
