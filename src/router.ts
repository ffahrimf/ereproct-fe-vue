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
        path: "/admin",
        name: "admin-list",
        component: () => import("./views/admin/admin-list.vue"),
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
