import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import landingRoutes from "./landing/index";
import authRoutes from "./auth";
import dashboardRoutes from "./dashboard";
import { mainStore } from "../store";

const routes: Array<RouteRecordRaw> = [
  ...landingRoutes,
  ...authRoutes,
  ...dashboardRoutes
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const store = mainStore();

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    next({ path: "/auth/login", query: { redirect: to.fullPath } });
    return;
  } else if (to.meta.requiresVisitor && store.isAuthenticated) {
    next("/dashboard");
    return;
  }

  const defaultTitle = "Bermentor - Platform Mentorship";
  const defaultDescription =
    "Platform mentorship terbaik untuk semua kalangan.";

  document.title = (to.meta.title as string) || defaultTitle;

  const descriptionElement = document.querySelector('meta[name="description"]');
  if (descriptionElement) {
    descriptionElement.setAttribute(
      "content",
      (to.meta.description as string) || defaultDescription
    );
  } else {
    const metaTag = document.createElement("meta");
    metaTag.setAttribute("name", "description");
    metaTag.setAttribute(
      "content",
      (to.meta.description as string) || defaultDescription
    );
    document.head.appendChild(metaTag);
  }

  next();
});

export default router;
