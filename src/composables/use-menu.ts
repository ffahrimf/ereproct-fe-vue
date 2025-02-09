import superadmin from "../components/sidebar/menu/superadmin";
import mentor from "../components/sidebar/menu/mentor";
import student from "../components/sidebar/menu/student";
import { useDecrypt } from "./use-helper";
import Cookies from "js-cookie";
import { ref, Ref } from "vue";

// Tentukan tipe role yang mungkin
type Role = string | null;

const emptyMenu: Ref<any[]> = ref([]);
const useMenu = ():
  | typeof superadmin
  | typeof mentor
  | typeof student
  | Ref<any[]> => {
  // Dapatkan dan decrypt cookie
  const role: Role = useDecrypt(Cookies.get("as-bermentor"));

  // Tentukan menu berdasarkan role
  switch (role) {
    case "Super Admin":
      return superadmin;
    case "MENTOR":
      return mentor;
    case "STUDENT":
      return student;
    default:
      return emptyMenu; // Jika role tidak ditemukan
  }
};

export default useMenu;
