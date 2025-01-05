import {
  createWebHistory,
  createRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from "vue-router";
import { mainStore } from "./store";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "in-app",
    component: () => import("./views/home.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        name: "overview",
        component: () => import("./views/overview/main-overview.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/company",
        name: "company-list",
        component: () => import("./views/company/company-list.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/company-structure/organization",
        name: "company-structure",
        component: () =>
          import("./views/company-structure/main-company-structure.vue"),
        meta: { requiresAuth: true },
        children: [
          {
            path: "",
            name: "company-organization",
            component: () =>
              import(
                "./views/company-structure/company-organization/company-organization-list.vue"
              ),
            meta: { requiresAuth: true }
          },
          {
            path: "/company-structure/title",
            name: "company-title",
            component: () =>
              import(
                "./views/company-structure/company-title/company-title-list.vue"
              ),
            meta: { requiresAuth: true }
          },
          {
            path: "/company-structure/level",
            name: "company-level",
            component: () =>
              import(
                "./views/company-structure/company-level/company-level-list.vue"
              ),
            meta: { requiresAuth: true }
          }
        ]
      },
      {
        path: "/attendance/shift",
        name: "attendance-shift-list",
        component: () =>
          import(
            "./views/attendance/attendance-shift/attendance-shift-list.vue"
          ),
        meta: { requiresAuth: true }
      },
      {
        path: "/attendance/location-setting",
        name: "attendance-location-setting-list",
        component: () =>
          import(
            "./views/attendance/attendance-location-setting/attendance-location-setting-list.vue"
          ),
        meta: { requiresAuth: true }
      },
      {
        path: "/admin",
        name: "admin-list",
        component: () => import("./views/admin/admin-list.vue"),
        meta: { requiresAuth: true }
      },
      {
        path: "/company-branch",
        name: "company-branch-list",
        component: () => import("./views/company-branch/company-branch-list.vue"),
        meta: { requiresAuth: true }
      },

      {
        path: "/employee-list",
        name: "employee-list",
        component: () => import("./views/employee/employee-list.vue"),
        meta: { requiresAuth: true }
      },

      {
        path: "/employee/set-up",
        name: "setup-employee",
        component: () =>
          import("./views/employee/setup-employee/main-setup-employee.vue"),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: "/auth/login",
    name: "logint",
    component: () => import("./views/auth/login.vue"),
    meta: { requiresVisitor: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(
  (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const store = mainStore();

    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!store.isAuthenticated) {
        next({
          path: "/auth/login",
          query: { redirect: to.fullPath }
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.meta.requiresVisitor)) {
      if (store.isAuthenticated) {
        const redirect = (to.query.redirect as string | undefined) ?? null;

        next({ path: redirect ?? "/" });
      } else {
        next();
      }
    } else {
      next();
    }
  }
);

export default router;
