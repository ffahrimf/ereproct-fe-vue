import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const assessment = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/",
    sub: [],
    toggle: false
  },
  {
    name: "Event List",
    icon: "calendar-days",
    permission: "all",
    path: "/event-list",
    sub: [],
    toggle: false
  },
  {
    name: "Proctoring",
    icon: "computer-desktop",
    permission: "all",
    path: "/proctoring-schedule",
    sub: [],
    toggle: false
  },

  {
    name: "Violation",
    icon: "x-circle",
    permission: "all",
    path: "/violation-master",
    sub: [],
    toggle: false
  },
  {
    name: "Proctor",
    icon: "users",
    permission: "all",
    path: "/proctor",
    sub: [],
    toggle: false
  }
]);

export default assessment;
