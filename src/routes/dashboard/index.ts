import { RouteRecordRaw } from "vue-router";
import userRoutes from "./user";

const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "in-app",
    component: () => import("../../views/home.vue"),
    meta: {
      requiresAuth: true,
      title: "Dashboard"
    },
    children: [
      {
        path: "/role",
        name: "role",
        component: () => import("../../views/role/role-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Role List"
        }
      },
      {
        path: "/event-list",
        name: "event-list",
        component: () => import("../../views/event/event-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Event List"
        }
      },
      {
        path: "/violation-master",
        name: "violation-master",
        component: () =>
          import("../../views/violation-master/violation-master-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Violation List"
        }
      },
      ...userRoutes
    ]
  }
];

export default dashboardRoutes;
