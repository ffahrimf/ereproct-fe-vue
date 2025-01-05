<template>
  <div class="h-full flex flex-col">
    <div class="h-[50px] p-3 flex items-center gap-2">
      <h-icon name="folder" outline></h-icon>
      <p class="text-sm text-slate-700">
        <span class="font-bold">HRIS</span> Integrated System
      </p>
    </div>
    <div class="px-3 mb-3">
      <div class="bg-slate-50 rounded p-3 flex items-center gap-3">
        <div class="w-7 h-7 bg-slate-500 rounded-md"></div>
        <div class="flex-1">
          <p class="text-sm font-medium">Isayana Sarasvati</p>
          <p class="text-xs text-slate-500">isyana@kerem.com</p>
        </div>
      </div>
    </div>
    <div class="flex-1 px-3 styled-scroll">
      <template v-if="menu.length">
        <div v-for="(item, i) in menu" :key="`menu-${i}`">
          <div class="overflow-hidden" v-if="item.sub.length">
            <button
              role="button"
              class="outline-none branched-menu"
              :class="branchedMenu(item)"
              @click="manageExpansion(i)"
            >
              <h-icon
                :name="item.icon"
                :mode="item['icon-type']"
                size="18"
                outline
              ></h-icon>
              <p class="text-left flex-1">{{ item.name }}</p>
              <h-icon
                name="chevron-down"
                class="transition-all"
                mode="mdi"
                :class="item.toggle ? 'rotate-180' : 'rotate-0'"
              ></h-icon>
            </button>
            <Collapse :when="item.toggle" class="v-collapse">
              <div class="flex">
                <div class="w-[20px] mr-2 border-r-2"></div>
                <div class="flex-1">
                  <router-link
                    v-for="(sub, j) in item.sub"
                    :key="`sub-${j}`"
                    :to="sub.path"
                    class="single-menu"
                    :class="singleMenu(sub)"
                  >
                    <p>{{ sub.name }}</p>
                  </router-link>
                </div>
              </div>
            </Collapse>
          </div>
          <router-link
            :to="item.path"
            :class="singleMenu(item)"
            class="single-menu mb-1"
            v-else
          >
            <h-icon
              :name="item.icon"
              size="18"
              :mode="item['icon-type']"
            ></h-icon>
            <p class="flex-1">{{ item.name }}</p>
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import useMenu from "../../composables/use-menu";
import { Collapse } from "vue-collapsed";
import { MenuIF } from "./menu/menu.interface";

const menu = useMenu();
const route = useRoute();

const manageExpansion = (idx: number): void => {
  if (menu.value[idx]?.toggle) {
    menu.value[idx].toggle = false;
  } else {
    menu.value.forEach((el) => {
      el.toggle = false;
    });
    menu.value[idx].toggle = true;
  }
};

const branchedMenu = (item: MenuIF): string => {
  let isInRoute = item.sub.some((el) => el.path == route.path);
  let styleRes =
    isInRoute || item.toggle
      ? "text-blue-500 bg-blue-100 hover:bg-blue-200"
      : "hover:bg-slate-100 text-slate-600";
  return styleRes;
};

const singleMenu = (item: MenuIF): string => {
  let styleRes =
    route.path == item.path
      ? "text-blue-500 bg-blue-100 hover:bg-blue-200"
      : "hover:bg-slate-100 text-slate-600";
  return styleRes;
};
</script>

<style lang="postcss" scoped>
.branched-menu {
  @apply flex gap-2 items-center py-2 px-3 mb-1 text-sm rounded-md w-full cursor-pointer font-medium;
  &:hover {
    @apply transition-all;
  }
}

.single-menu {
  @apply flex gap-2 items-center py-2 px-3 text-sm rounded-md font-medium;
  &:hover {
    @apply transition-all;
  }
}
</style>
