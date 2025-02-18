<template>
  <div
    id="header"
    class="flex justify-between items-center lg:bg-white fixed w-full z-20 text-xs xl:text-sm top-0 start-0 lg:border-b-[2px] lg:border-gray-200 transition-all duration-300 ease-in-out py-5 px-5 md:px-10 lg:px-20"
  >
    <div>
      <img src="../../assets/img/landing/logo-text.png" class="w-40" alt="" />
    </div>
    <div>
      <nav class="hidden lg:block">
        <ul class="flex space-x-5 list-none">
          <router-link
            v-for="(item, i) in menuData"
            :key="`menu-${i}`"
            :to="item.path"
            class="hover:text-primary"
            active-class="text-primary font-bold"
            exact-active-class="text-primary font-bold"
          >
            <li>{{ item.name }}</li>
          </router-link>
        </ul>
      </nav>
    </div>
    <button
      @click="expand = !expand"
      class="block lg:hidden p-2 rounded-full"
      :class="expand ? 'bg-slate-50' : 'bg-transparent'"
    >
      <h-icon
        name="bars-3"
        size="30"
        class="transition-all duration-1000 ease-in-out transform"
        :class="{
          'rotate-0': expand,
          'rotate-180': !expand
        }"
      />
    </button>

    <div class="space-x-2 hidden lg:block">
      <router-link :to="`/auth/register/mentor`"
        ><button
          class="bg-secondary rounded-full active:scale-95 py-2.5 px-6 text-white border-4 border-white hover:border-[#FFC8AA] transition duration-1000 ease-out"
        >
          Daftar menjadi Mentor
        </button></router-link
      >
      <h-nav-menu closeOnClick closeOnClickOutside>
        <button
          class="border-2 border-secondary hover:border-[#FFC8AA] active:scale-95 rounded-full py-2.5 px-6 text-secondary bg-transparent transition duration-1000 ease-out"
        >
          Masuk
        </button>
        <template #item>
          <div class="min-w-[220px] px-2 py-1 text-word text-xs xl:text-sm">
            <router-link :to="`/auth/login`">
              <div
                class="flex py-3 px-10 mt-1 justify-center rounded cursor-pointer mb-1 group"
              >
                <p
                  class="group-hover:text-secondary transition duration-300 ease-in-out"
                >
                  Masuk sebagai pelajar
                </p>
              </div>
            </router-link>
            <router-link :to="`/auth/register/student`">
              <div
                class="flex py-3 px-10 bg-panel hover:bg-opacity-60 justify-center transition duration-300 ease-in-out rounded-full cursor-pointer mb-1"
              >
                <p>Daftar sebagai pelajar</p>
              </div>
            </router-link>
          </div>
        </template>
      </h-nav-menu>
    </div>
  </div>
  <Drawer :dialog="expand" @close="expand = false" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";
import menu from "./menu.interface";
import Drawer from "./drawer.vue";

const menuData = menu;
const expand = ref<boolean>(false);

const updateHeaderBg = () => {
  const header = document.getElementById("header");
  if (header) {
    if (window.scrollY > 50 || expand.value) {
      header.classList.remove("bg-transparent");
      header.classList.add("bg-white", "border-b-[2px]", "border-gray-200");
    } else {
      header.classList.remove("bg-white", "border-b-[2px]", "border-gray-200");
      header.classList.add("bg-transparent");
    }
  }
};

const onScroll = () => updateHeaderBg();

onMounted(() => {
  window.addEventListener("scroll", onScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
});

watch(expand, () => updateHeaderBg());
</script>

<style scoped></style>
