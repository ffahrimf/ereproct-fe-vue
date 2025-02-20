import { RouteRecordRaw } from "vue-router";
import userRoutes from "./user";

const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "in-app",
    component: () => import("../../views/home.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard",
      description: "Kelola mentor dan student di dashboard Bermentor."
    },
    children: [
      {
        path: "/overview",
        name: "overview",
        component: () => import("../../views/overview/main-overview.vue"),
        meta: {
          requiresAuth: true,
          title: "Overview",
          description: "Tinjau performa mentorship Anda di Overview."
        }
      },
      ...userRoutes
    ]
  }
];

export default dashboardRoutes;
