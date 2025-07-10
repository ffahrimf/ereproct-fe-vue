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
        path: "/overview",
        name: "overview",
        component: () => import("../../views/overview/main-overview.vue"),
        meta: {
          requiresAuth: true,
          title: "Overview",
          allowedRoles: ["SUPERADMIN", "ASSESSMENT", "PROCTOR", "RESEARCH"]
        }
      },
      {
        path: "/role",
        name: "role",
        component: () => import("../../views/role/role-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Role List",
          allowedRoles: ["SUPERADMIN"]
        }
      },
      {
        path: "/event-list",
        name: "event-list",
        component: () => import("../../views/event/event-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Event List",
          allowedRoles: ["ASSESSMENT"]
        }
      },
      {
        path: "/proctoring-schedule",
        name: "proctoring-schedule",
        component: () =>
          import("../../views/proctoring/main-proctoring-schedule.vue"),
        meta: {
          requiresAuth: true,
          title: "Proctoring Schedule",
          allowedRoles: ["PROCTOR", "ASSESSMENT"]
        }
      },
      {
        path: "/report",
        name: "report",
        component: () => import("../../views/report/main-report.vue"),
        meta: {
          requiresAuth: true,
          title: "Report List",
          allowedRoles: ["PROCTOR", "RESEARCH"]
        }
      },
      {
        path: "/report/set-up",
        name: "setup-report",
        component: () =>
          import("../../views/report/setup-report/main-setup-report.vue"),
        meta: {
          requiresAuth: true,
          title: "Setup Report",
          allowedRoles: ["PROCTOR"]
        }
      },
      {
        path: "/report/review",
        name: "review-report",
        component: () => import("../../views/report/review-report.vue"),
        meta: {
          requiresAuth: true,
          title: "Review Report",
          allowedRoles: ["RESEARCH"]
        }
      },
      {
        path: "/violation-master",
        name: "violation-master",
        component: () =>
          import("../../views/violation-master/violation-master-list.vue"),
        meta: {
          requiresAuth: true,
          title: "Violation List",
          allowedRoles: ["ASSESSMENT"]
        }
      },
      ...userRoutes
    ]
  }
];

export default dashboardRoutes;
