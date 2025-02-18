import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const superadmin = ref<MenuIF[]>([
  {
    name: "Overview",
    icon: "squares-2X2",
    path: "/overview",
    sub: [],
    toggle: false
  },
  {
    name: "User",
    icon: "account",
    "icon-type": "mdi",
    permission: "all",
    path: "",
    sub: [
      {
        name: "Mentor",
        permission: "all",
        path: "/user/mentor"
      },
      {
        name: "Student",
        path: "/user/student"
      }
    ],
    toggle: false
  }
]);

export default superadmin;
