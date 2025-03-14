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
    name: "Schedule",
    icon: "monitor-account",
    "icon-type": "mdi",
    permission: "all",
    path: "/schedule",
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
  },
  {
    name: "Violation",
    icon: "x-circle",
    permission: "all",
    path: "/violation-master",
    sub: [],
    toggle: false
  }
]);

export default assessment;
