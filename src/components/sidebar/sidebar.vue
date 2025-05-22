<template>
  <div class="h-full flex flex-col">
    <div class="flex items-center h-[100px] p-10">
      <img src="../../assets/img/logo-text.png" class="h-[30px]" alt="" />
    </div>
    <div class="flex flex-col h-full">
      <div class="flex-1 pl-10 styled-scroll">
        <template v-if="menu.length">
          <div
            v-for="(item, i) in menu"
            :key="`menu-${i}`"
            class="pr-10 relative"
          >
            <span
              v-if="isMenuActive(item)"
              class="aspect-square w-1 rounded-xl bg-primary absolute right-0 h-full"
            ></span>

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
                      <p class="">{{ sub.name }}</p>
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
                outline
              ></h-icon>
              <p class="flex-1">{{ item.name }}</p>
            </router-link>
          </div>
        </template>
      </div>
      <div class="px-10 pb-7">
        <button
          @click="dialog.logout = true"
          class="py-2 px-3 hover:bg-slate-100 rounded-lg w-full group transition duration-300 ease-in-out"
        >
          <div class="flex items-center space-x-2 text-gray-700 text-sm">
            <h-icon name="arrow-right-start-on-rectangle" size="18" />
            <p>Log out</p>
          </div>
        </button>
      </div>
    </div>
  </div>
  <DialogLogout :dialog="dialog.logout" @close="dialog.logout = false" />
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router";
import useMenu from "../../composables/use-menu";
import { Collapse } from "vue-collapsed";
import { MenuIF } from "./menu/menu.interface";
import DialogLogout from "../dialog-logout.vue";
import { reactive } from "vue";

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
      ? "text-white bg-primary hover:bg-primaryHover"
      : "hover:bg-slate-100 text-black";
  return styleRes;
};

const singleMenu = (item: MenuIF): string => {
  let styleRes =
    route.path == item.path
      ? "text-white bg-primary hover:bg-primaryHover"
      : "hover:bg-slate-100 text-black";
  return styleRes;
};

const isMenuActive = (item: MenuIF): boolean => {
  return (
    item.toggle ||
    route.path === item.path ||
    item.sub.some((sub) => sub.path === route.path)
  );
};

interface DialogIf {
  logout: boolean;
}

const dialog = reactive<DialogIf>({
  logout: false
});
</script>

<style lang="postcss" scoped>
.branched-menu {
  @apply flex gap-2 items-center py-2 px-3 mb-1 text-sm rounded-md w-full cursor-pointer;
  &:hover {
    @apply transition-all;
  }
}

.single-menu {
  @apply flex gap-2 items-center py-2 px-3 text-sm rounded-md;
  &:hover {
    @apply transition-all;
  }
}
</style>
