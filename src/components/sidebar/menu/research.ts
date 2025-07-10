import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const research = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/overview",
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

export default research;
