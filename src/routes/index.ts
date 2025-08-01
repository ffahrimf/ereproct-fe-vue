// routes/index.ts

import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import authRoutes from "./auth";
import dashboardRoutes from "./dashboard";
import { mainStore } from "../store";
import { updateMetaTags } from "./meta";
import notFoundRoutes from "./404";

const routes: Array<RouteRecordRaw> = [
  ...authRoutes,
  ...dashboardRoutes,
  ...notFoundRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, _from, next) => {
  const store = mainStore();

  updateMetaTags(to);

  // Auth Guards
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.isAuthenticated) {
      next({
        path: "/auth/login",
        query: { redirect: to.fullPath }
      });
    } else {
      // Cast type nya
      const allowedRoles = (to.meta as any).allowedRoles;
      if (allowedRoles && !allowedRoles.includes(store.role)) {
        next({ path: "/" });
        // next({ path: "/unauthorized" });
      } else {
        next();
      }
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
});

export default router;
