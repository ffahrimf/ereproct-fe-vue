import { RouteRecordRaw } from "vue-router";
import userRoutes from "./user"; // Import user routes dari file user.ts

const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: "/dashboard",
    name: "in-app",
    component: () => import("../../views/dashboard/index.vue"),
    meta: {
      requiresAuth: true,
      title: "Bermentor - Dashboard",
      description: "Kelola mentor dan student di dashboard Bermentor."
    },
    children: [
      {
        path: "/dashboard/overview",
        name: "overview",
        component: () =>
          import("../../views/dashboard/overview/main-overview.vue"),
        meta: {
          requiresAuth: true,
          title: "Bermentor - Overview",
          description: "Tinjau performa mentorship Anda di Overview."
        }
      },
      ...userRoutes
    ]
  }
];

export default dashboardRoutes;
