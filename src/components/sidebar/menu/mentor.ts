import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const mentor = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/dashboard/overview",
    sub: [],
    toggle: false
  }
]);

export default mentor;
