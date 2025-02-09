import { RouteRecordRaw } from "vue-router";

const landingRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "welcome",
    component: () => import("../../views/landing/index.vue"),
    meta: {
      requiresAuth: false,
      title: "Bermentor - Temukan Mentor Terbaik, Mulai Belajar Sekarang!",
      description: "Selamat datang di Bermentor, platform mentorship terbaik!"
    }
  },
  {
    path: "/about",
    name: "about-us",
    component: () => import("../../views/landing/about.vue"),
    meta: {
      requiresAuth: false,
      title: "Bermentor - Profil",
      description: "Bermentor adalah platform untuk meningkatkan keahlian kamu!"
    }
  }
];

export default landingRoutes;
