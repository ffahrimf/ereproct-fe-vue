import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const student = ref<MenuIF[]>([
  {
    name: "Overview",
    icon: "squares-2x2",
    path: "/dashboard/overview",
    sub: [],
    toggle: false
  }
]);

export default student;
