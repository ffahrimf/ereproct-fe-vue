<template>
  <div class="flex flex-col mt-[100px]">
    <div class="absolute top-0 h-[100px] pt-8 ml-10">
      <slot name="header-searchbar"></slot>
    </div>
    <div class="px-10 flex mb-3 items-center justify-between">
      <p class="font-semibold text-xl">{{ title }}</p>
      <slot name="header-action"></slot>
    </div>

    <div class="flex flex-col px-10 mt-2 space-y-1">
      <div class="bg-white rounded-t-2xl flex-1">
        <slot></slot>
      </div>

      <div class="py-3 px-5 bg-white rounded-b-2xl">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  title: { type: String, default: "Title Menu" },
  subtitle: { type: String, default: "Subitle Menu" },
  icon: { type: String, default: "computer-desktop" },
  iconType: { type: String, default: "heroicon" },
  padding: { type: Boolean, default: true }
});
</script>
