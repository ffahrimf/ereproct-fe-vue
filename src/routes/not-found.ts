import { RouteRecordRaw } from "vue-router";

const notFoundRoutes: Array<RouteRecordRaw> = [
  {
    path: "/:pathMatch(.*)*",

    name: "NotFound",
    component: () => import("../../src/views/not-found.vue"),

    meta: {
      title: "Page Not Found",
      description: "Maaf, halaman yang anda cari tidak ditemukan."
    }
  }
];

export default notFoundRoutes;
