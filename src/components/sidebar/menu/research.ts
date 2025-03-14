import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const research = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/",
    sub: [],
    toggle: false
  }
]);

export default research;
