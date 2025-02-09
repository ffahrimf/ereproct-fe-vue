<template>
  <h-drawer :dialog="dialog">
    <div
      class="bg-white rounded-md shadow-lg w-[300px] md:w-[500px] flex flex-col h-[97vh] relative p-4 overflow-y-auto"
    >
      <h5 class="text-base font-semibold text-gray-500 uppercase">Menu</h5>
      <icon-btn
        icon="x-mark"
        color="text-gray-500"
        @click="emit('close')"
        class="absolute top-2.5 end-2.5 inline-flex active:bg-transparent items-center justify-center"
      />

      <div class="py-4 overflow-y-auto">
        <ul class="space-y-2">
          <router-link
            v-for="(item, i) in menuData"
            :key="`menu-${i}`"
            :to="item.path"
          >
            <li>
              <a href="#" class="flex items-center p-2 text-word rounded-lg">
                <h-icon
                  :name="item.icon"
                  :mode="item['icon-type'] || 'heroicons'"
                  color="text-gray-500"
                  size="20"
                  :outline="item.outline"
                />
                <span class="ms-3 text-xs md:text-base">{{ item.name }}</span>
              </a>
            </li>
          </router-link>
        </ul>
        <hr class="mt-2 mb-2" />
        <ul>
          <li class="flex flex-col text-word text-xs md:text-base">
            <router-link :to="`auth/login`"
              ><button class="flex items-center p-2 rounded-lg">
                <h-icon name="login" mode="mdi" color="text-gray-500" /><span
                  class="ms-3"
                  >Masuk</span
                >
              </button>
            </router-link>
            <h-nav-menu closeOnClick>
              <button class="flex items-center p-2 text-word rounded-lg">
                <h-icon
                  name="account-plus"
                  mode="mdi"
                  color="text-gray-500"
                /><span class="ms-3">Daftar</span>
              </button>
              <template #item>
                <div class="min-w-[220px] px-2 py-1">
                  <router-link :to="`auth/register`">
                    <div
                      class="flex py-3 px-10 mt-1 justify-center rounded cursor-pointer mb-1 group"
                    >
                      <p
                        class="group-hover:text-secondary transition duration-300 ease-in-out"
                      >
                        Daftar sebagai pelajar
                      </p>
                    </div>
                  </router-link>
                  <router-link :to="`auth/register`"
                    ><div
                      class="flex py-3 px-10 bg-panel hover:bg-opacity-60 justify-center transition duration-300 ease-in-out rounded-full cursor-pointer mb-1"
                    >
                      <p>Daftar sebagai mentor</p>
                    </div>
                  </router-link>
                </div>
              </template>
            </h-nav-menu>
          </li>
        </ul>
      </div>

      <h-overlay
        :value="loading"
        absolute
        class="flex items-center justify-center gap-3"
      >
        <spinner />
      </h-overlay>
    </div>
  </h-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import menu from "./menu.interface";

const menuData = menu;
const emit = defineEmits(["close", "refetch"]);
const loading = ref<boolean>(false);

defineProps({
  dialog: Boolean
});
</script>
