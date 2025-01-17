<template>
  <div class="flex w-full relative min-h-screen">
    <div
      class="bg-white h-screen border-r fixed w-[260px] top-0 transition-all duration-300"
      :class="expand ? 'left-0' : 'left-[-300px]'"
    >
      <div class="">
        <button
          @click="expand = !expand"
          class="p-1 rounded hover:bg-slate-50 absolute top-3 transition-all duration-300"
          :class="expand ? 'right-3' : 'right-[-80px]'"
        >
          <Drawer class="w-[18px] h-[18px]" />
        </button>
      </div>

      <Sidebar />
    </div>
    <div
      class="flex-1 bg-[#F3F5F6] transition-all duration-300"
      :class="expand ? 'ml-[260px]' : 'ml-0'"
    >
      <div class="h-[50px] flex-1 flex items-center justify-end px-5">
        <div class="flex items-center gap-2">
          <button
            class="rounded border border-slate-300 p-1 outline-none bg-white hover:bg-slate-100"
          >
            <h-icon
              name="bell"
              size="16"
              class="text-slate-600"
              outline
            ></h-icon>
          </button>
          <h-menu>
            <button
              class="rounded border border-slate-300 p-1 outline-none bg-white hover:bg-slate-100"
            >
              <h-icon
                name="user"
                size="16"
                class="text-slate-600"
                outline
              ></h-icon>
            </button>
            <template #item>
              <div class="min-w-[170px] p-1">
                <div
                  class="flex items-center gap-2 p-1 text-sm text-slate-600 hover:bg-blue-50 rounded cursor-pointer mb-1"
                >
                  <h-icon name="user" outline />
                  <p>Profile</p>
                </div>
                <div
                  class="flex items-center gap-2 p-1 text-sm text-slate-600 hover:bg-blue-50 rounded cursor-pointer mb-1"
                >
                  <h-icon name="cog-6-tooth" outline />
                  <p>Setting</p>
                </div>
                <div class="border-t mb-1"></div>

                <div
                  class="flex items-center gap-2 p-1 text-sm text-slate-600 hover:bg-blue-50 rounded cursor-pointer mb-1"
                >
                  <h-icon name="document" outline />
                  <p>Guide</p>
                </div>
                <div
                  class="flex items-center gap-2 p-1 text-sm text-slate-600 hover:bg-blue-50 rounded cursor-pointer mb-1"
                >
                  <h-icon name="question-mark-circle" outline />
                  <p>Help Center</p>
                </div>
                <div class="border-t mb-1"></div>
                <div
                  class="flex items-center gap-2 p-1 text-sm text-slate-600 hover:bg-blue-50 rounded cursor-pointer mb-1"
                  @click="logout"
                >
                  <h-icon name="arrow-left-start-on-rectangle" />
                  <p>Logout</p>
                </div>
              </div>
            </template>
          </h-menu>
        </div>
      </div>
      <router-view v-if="store.profile" />
    </div>
    <SplashScreen v-if="store.splash" />
  </div>
</template>

<script lang="ts" setup>
import Sidebar from "../../components/sidebar/sidebar.vue";
import Drawer from "../../components/icons/drawer.vue";
import { onMounted, ref } from "vue";
import { useRemoveStorage } from "../../composables/use-helper";
import useApi from "../../composables/use-api";
import { mainStore } from "../../store";
import { MentorIF } from "./user/mentor/mentor.interface";
import SplashScreen from "../../components/splash-screen.vue";
import { useRouter } from "vue-router";
const expand = ref<boolean>(true);
const router = useRouter();

const logout = () => {
  useRemoveStorage();
  store.profile = null;
  store.token = null;
  store.role = null;
  store.guid = null;
  router.push("/");
};

const api = new useApi();
const store = mainStore();
const getProfile = () => {
  store.splash = true;
  api.get(`user?id=${store.guid}`).then((res) => {
    const raw: MentorIF | null = res.data.items[0] ?? null;
    store.profile = raw;
    store.splash = false;
  });
};

onMounted(() => {
  getProfile();
});
</script>
