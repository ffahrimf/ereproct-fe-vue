import { RouteRecordRaw } from "vue-router";

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "user-list",
    component: () => import("../../views/user/user-list.vue"),
    meta: {
      requiresAuth: true,
      title: "User List",
      allowedRoles: ["SUPERADMIN"]
    }
  },
  {
    path: "/assessment",
    name: "assesstment-list",
    component: () =>
      import("../../views/stakeholder/assessment/assessment-list.vue"),
    meta: {
      requiresAuth: true,
      title: "Assessment List",
      allowedRoles: ["SUPERADMIN"]
    }
  },
  {
    path: "/proctor",
    name: "proctor-list",
    component: () => import("../../views/stakeholder/proctor/proctor-list.vue"),
    meta: {
      requiresAuth: true,
      title: "Proctor List",
      allowedRoles: ["ASSESSMENT"]
    }
  },
  {
    path: "/research",
    name: "research-list",
    component: () =>
      import("../../views/stakeholder/research/research-list.vue"),
    meta: {
      requiresAuth: true,
      title: "Research List",
      allowedRoles: ["SUPERADMIN"]
    }
  }
];

export default userRoutes;
