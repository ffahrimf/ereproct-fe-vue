import superadmin from "../components/sidebar/menu/superadmin";
import admin from "../components/sidebar/menu/admin";
import employee from "../components/sidebar/menu/exmployee";
import { useDecrypt } from "./use-helper";
import Cookies from "js-cookie";
import { ref, Ref } from "vue";

// Tentukan tipe role yang mungkin
type Role = string | null;

const emptyMenu: Ref<any[]> = ref([]);
const useMenu = ():
  | typeof superadmin
  | typeof admin
  | typeof employee
  | Ref<any[]> => {
  // Dapatkan dan decrypt cookie
  const role: Role = useDecrypt(Cookies.get("as-hris"));

  // Tentukan menu berdasarkan role
  switch (role) {
    case "SUPERADMIN":
      return superadmin;
    case "ADMIN":
      return admin;
    case "EMPLOYEE":
      return employee;
    default:
      return emptyMenu; // Jika role tidak ditemukan
  }
};

export default useMenu;
