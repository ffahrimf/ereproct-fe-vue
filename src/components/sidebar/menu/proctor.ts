import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const proctor = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/",
    sub: [],
    toggle: false
  },
  {
    name: "Schedule",
    icon: "monitor-account",
    "icon-type": "mdi",
    permission: "all",
    path: "/schedule",
    sub: [],
    toggle: false
  }
]);

export default proctor;
