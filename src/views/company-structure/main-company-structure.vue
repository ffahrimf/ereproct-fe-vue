<template>
  <TableLayout
    title="Company Structure"
    subtitle="Manage your copany structure"
    icon="rectangle-group"
    :padding="false"
  >
    <div>
      <div class="border-b flex items-center gap-3 px-5">
        <div
          v-for="menu in menus"
          class="py-2 px-5 cursor-pointer hover:bg-blue-50"
          :class="menu.path == currentTab ? 'border-b-2 border-blue-500' : ''"
          @click="changeRoute(menu.path)"
        >
          <div
            class="font-medium flex items-center gap-3"
            :class="
              menu.path == currentTab ? 'text-blue-500' : 'text-slate-600'
            "
          >
            <h-icon :name="menu.icon" mode="mdi" />
            <p>{{ menu.title }}</p>
          </div>
        </div>
      </div>

      <div class="py-3">
        <router-view />
      </div></div
  ></TableLayout>
</template>

<script setup>
import { ref } from "vue";
import TableLayout from "../../components/table-layout.vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

const currentTab = ref(route.fullPath);

const menus = ref([
  {
    title: "Organization",
    path: "/company-structure/organization",
    icon: "graph"
  },
  {
    title: "Title",
    path: "/company-structure/title",
    icon: "account-box"
  },
  {
    title: "Level",
    path: "/company-structure/level",
    icon: "signal-cellular-3"
  }
]);

const changeRoute = (path) => {
  currentTab.value = path;
  router.push(currentTab.value);
};
</script>
