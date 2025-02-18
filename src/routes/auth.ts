import { RouteRecordRaw } from "vue-router";

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: "/auth/login",
    name: "login",
    component: () => import("../views/auth/login.vue"),
    meta: {
      requiresVisitor: true,
      title: "Bermentor - Login",
      description: "Masuk ke akun Bermentor Anda untuk mulai mentoring."
    }
  },
  {
    path: "/auth/register/mentor",
    name: "mentor-register",
    component: () => import("../views/auth/register/mentor/index.vue"),
    meta: {
      requiresVisitor: true,
      title: "Bermentor - Daftar sebagai Mentor",
      description:
        "Bergabung sebagai mentor di Bermentor dan mulai berbagi ilmu dengan para student."
    }
  },
  {
    path: "/auth/register/student",
    name: "student-register",
    component: () => import("../views/auth/register/student/index.vue"),
    meta: {
      requiresVisitor: true,
      title: "Bermentor - Daftar sebagai Student",
      description:
        "Daftar sekarang di Bermentor untuk belajar langsung dari para mentor ahli."
    }
  }
];

export default authRoutes;
