import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const superadmin = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    path: "/",
    sub: [],
    toggle: false
  },
  {
    name: "Role",
    icon: "key",
    path: "/role",
    sub: [],
    toggle: false
  },
  {
    name: "User",
    icon: "user",
    path: "/user",
    sub: [],
    toggle: false
  },
  {
    name: "Assessment",
    icon: "arrow-trending-up",
    path: "/assessment",
    sub: [],
    toggle: false
  },
  {
    name: "Research",
    icon: "magnifying-glass-circle",
    path: "/research",
    sub: [],
    toggle: false
  }
]);

export default superadmin;
