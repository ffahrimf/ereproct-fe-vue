import { ref } from "vue";

export interface MenuIF {
  name: string;
  path: string;
  icon: string;
  sub: subMenuIF[] | [];
  toggle: boolean;
  permission?: string;
  "icon-type"?: string;
  outline?: boolean;
}

interface subMenuIF {
  name: string;
  path: string;
  permission?: string;
}

const menu = ref<MenuIF[]>([
  {
    name: "Beranda",
    permission: "all",
    icon: "chart-bar",

    "icon-type": "",
    path: "/",
    sub: [],
    toggle: false
  },
  {
    name: "Profil",
    icon: "identification",
    "icon-type": "",

    permission: "all",
    path: "/about",
    sub: [],
    toggle: false
  },
  {
    name: "Kategori",
    icon: "tag",
    "icon-type": "",

    permission: "all",
    path: "/category",
    sub: [],
    toggle: false
  }
]);

export default menu;
