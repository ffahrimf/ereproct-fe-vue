import {
  createWebHistory,
  createRouter,
  RouteRecordRaw,
  RouteLocationNormalized,
  NavigationGuardNext
} from "vue-router";
import authRoutes from "./auth";
import dashboardRoutes from "./dashboard";
import { mainStore } from "../store";

const routes: Array<RouteRecordRaw> = [...authRoutes, ...dashboardRoutes];

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
