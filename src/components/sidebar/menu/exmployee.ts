import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const employee = ref<MenuIF[]>([
  {
    name: "Overview",
    icon: "squares-2x2",
    path: "/",
    sub: [],
    toggle: false,
  },
  {
    name: "Company",
    icon: "building-office-2",
    path: "/company-list",
    sub: [],
    toggle: false,
  },
  {
    name: "Company",
    icon: "user-group",
    path: "/company-organization-list",
    sub: [],
    toggle: false,
  },
  {
    name: "Admin",
    icon: "/company-list",
    path: "/",
    sub: [],
    toggle: false,
  },
]);

export default employee;
