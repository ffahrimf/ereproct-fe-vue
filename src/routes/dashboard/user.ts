import { RouteRecordRaw } from "vue-router";

const userRoutes: Array<RouteRecordRaw> = [
  {
    path: "/user/mentor",
    name: "mentor-list",
    component: () =>
      import("../../views/dashboard/user/mentor/mentor-list.vue"),
    meta: {
      requiresAuth: true,
      title: "Bermentor - Mentor List",
      description: "Daftar mentor terbaik tersedia di sini."
    }
  },
  {
    path: "/user/student",
    name: "student-list",
    component: () =>
      import("../../views/dashboard/user/student/student-list.vue"),
    meta: {
      requiresAuth: true,
      title: "Bermentor - Student List",
      description: "Daftar student terhubung dengan mentor di sini."
    }
  }
];

export default userRoutes;
