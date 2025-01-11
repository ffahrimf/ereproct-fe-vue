import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const superadmin = ref<MenuIF[]>([
  {
    name: "Overview",
    icon: "squares-2X2",
    path: "/dashboard/overview",
    sub: [],
    toggle: false
  },
  {
    name: "Mentor",
    icon: "account-tie",
    "icon-type": "mdi",
    path: "/dashboard/user/mentor",
    sub: [],
    toggle: false
  },
  {
    name: "Student",
    icon: "academic-cap",
    path: "/dashboard/user/student",
    sub: [],
    toggle: false
  }
]);

export default superadmin;
