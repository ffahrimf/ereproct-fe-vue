<template>
  <div style="min-height: calc(100vh - 50px)" class="flex flex-col">
    <div class="pb-3 px-5 flex justify-between">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white rounded-lg border">
          <h-icon :name="icon" size="21" class="text-blue-500"></h-icon>
        </div>
        <div class="flex-1">
          <p class="font-bold leading-3 mb-1">{{ title }}</p>
          <p class="text-slate-500 text-sm leading-3">{{ subtitle }}</p>
        </div>
      </div>
      <slot name="header-action"></slot>
    </div>

    <div class="bg-white flex-1 border-t" :class="padding ? 'px-5 py-3' : ''">
      <slot></slot>
    </div>
    <div class="border-t py-3 px-5 bg-white">
      <slot name="footer"></slot>
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
