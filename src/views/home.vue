<template>
  <div class="flex w-full relative min-h-screen">
    <div
      class="bg-white h-screen border-r fixed w-[260px] top-0 transition-all duration-300"
      :class="expand ? 'left-0' : 'left-[-300px]'"
    >
      <div class="">
        <button
          @click="expand = !expand"
          class="p-1 rounded hover:bg-stone-50 absolute transition-all duration-300 top-10"
          :class="expand ? 'right-5 ' : 'right-[-80px] '"
        >
          <h-icon
            :name="expand ? 'arrow-expand-left' : 'arrow-expand-right'"
            mode="mdi"
            size="13"
            class="text-gray-500"
          />
        </button>
      </div>

      <Sidebar />
    </div>
    <div
      class="flex-1 bg-stone-100 pb-10 transition-all duration-300"
      :class="expand ? 'ml-[260px]' : 'ml-0'"
    >
      <div class="h-[100px] absolute z-3 right-0 pr-10">
        <div class="flex items-center mt-8 gap-4">
          <h-menu class="">
            <template #default="{ isOpen }">
              <button class="flex">
                <h-icon
                  name="inbox"
                  :class="isOpen ? 'text-primary' : ''"
                  outline
                ></h-icon></button
            ></template>
          </h-menu>
          <h-menu class="">
            <template #default="{ isOpen }">
              <button class="flex">
                <h-icon
                  name="bell"
                  :class="isOpen ? 'text-primary' : ''"
                  outline
                ></h-icon></button></template
          ></h-menu>
          <div class="flex items-center space-x-2">
            <h-avatar size="35" />
            <div class="flex flex-col">
              <p class="text-sm font-medium">John Doe</p>
              <p class="text-[10px] text-gray-700 font-light">
                johndoe@gmail.com
              </p>
            </div>
          </div>
          <h-menu>
            <template #default="{ isOpen }">
              <button>
                <h-icon
                  name="chevron-down"
                  size="18"
                  class="text-gray-500 transition-all duration-300"
                  :class="isOpen ? 'rotate-180' : 'rotate-0'"
                  outline
                ></h-icon></button
            ></template>
          </h-menu>
        </div>
      </div>

      <router-view v-if="store.profile" />
    </div>
    <SplashScreen v-if="store.splash" />
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "../components/sidebar/sidebar.vue";
import useApi from "../composables/use-api";
import { mainStore } from "../store";
import { UserIF } from "./user/user.interface";
import SplashScreen from "../components/splash-screen.vue";
import { onMounted, ref } from "vue";

const expand = ref<boolean>(true);

const api = new useApi();
const store = mainStore();
const getProfile = () => {
  store.splash = true;
  api.get(`user?id=${store.guid}`).then((res) => {
    const raw: UserIF | null = res.data.items[0] ?? null;
    store.profile = raw;
    store.splash = false;
  });
};

onMounted(() => {
  getProfile();
});
</script>
