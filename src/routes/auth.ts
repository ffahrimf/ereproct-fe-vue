import { RouteRecordRaw } from "vue-router";

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/auth/login",
    name: "logint",
    component: () => import("../views/auth/login.vue"),
    meta: {
      requiresVisitor: true,
      title: "Bermentor - Login",
      description: "Masuk ke akun Bermentor Anda untuk mulai mentoring."
    }
  }
];

export default authRoutes;
