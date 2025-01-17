import { RouteRecordRaw } from "vue-router";

const landingRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "landing",
    component: () => import("../../views/landing/index.vue"),
    meta: {
      requiresAuth: false,
      title: "Bermentor - Landing Page",
      description: "Selamat datang di Bermentor, platform mentorship terbaik!"
    }
  }
];

export default landingRoutes;
