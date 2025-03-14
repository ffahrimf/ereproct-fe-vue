import superadmin from "../components/sidebar/menu/superadmin";
import assessment from "../components/sidebar/menu/assessment";
import proctor from "../components/sidebar/menu/proctor";
import research from "../components/sidebar/menu/research";
import { useDecrypt } from "./use-helper";
import Cookies from "js-cookie";
import { ref, Ref } from "vue";

// Tentukan tipe role yang mungkin
type Role = string | null;

const emptyMenu: Ref<any[]> = ref([]);
const useMenu = ():
  | typeof superadmin
  | typeof assessment
  | typeof proctor
  | typeof research
  | Ref<any[]> => {
  // Dapatkan dan decrypt cookie
  const role: Role = useDecrypt(Cookies.get("as-ereproct"));

  // Tentukan menu berdasarkan role
  switch (role) {
    case "SUPERADMIN":
      return superadmin;
    case "ASSESSMENT":
      return assessment;
    case "PROCTOR":
      return proctor;
    case "RESEARCH":
      return research;
    default:
      return emptyMenu; // Jika role tidak ditemukan
  }
};

export default useMenu;
