import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const superadmin = ref<MenuIF[]>([
  {
    name: "Overview",
    icon: "squares-2X2",
    path: "/",
    sub: [],
    toggle: false,
  },
  {
    name: "Company",
    icon: "briefcase",
    path: "/company",
    sub: [],
    toggle: false,
  },
  {
    name: "Admin",
    icon: "user",
    path: "/admin",
    sub: [],
    toggle: false,
  },
]);

export default superadmin;
