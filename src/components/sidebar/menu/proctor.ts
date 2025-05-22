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
    icon: "computer-desktop",
    permission: "all",
    path: "/proctoring-schedule",
    sub: [],
    toggle: false
  },
  {
    name: "Report",
    icon: "clipboard-document-check",
    permission: "all",
    path: "/report",
    sub: [],
    toggle: false
  }
]);

export default proctor;
