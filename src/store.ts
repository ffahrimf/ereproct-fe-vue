import { defineStore } from "pinia"; // define store dari pinia
import Cookies from "js-cookie";
import { useDecrypt } from "./composables/use-helper";
import { State } from "./interface/store.interface";

export const mainStore = defineStore("main", {
  state: (): State => ({
    mode: import.meta.env.MODE,
    token: useDecrypt(Cookies.get("hAS-aTH")),
    role: useDecrypt(Cookies.get("as-bermentor")),
    guid: useDecrypt(Cookies.get("glbl-unq-hr")),
    manager: useDecrypt(Cookies.get("aprvl-ln")),
    id_table: null,
    profile: null,
    company: null,
    permissions: [],
    placement: null,
    expand: true,
    isErr: false,
    dataErr: null,
    isOffline: true,
    isTimeout: false,
    ua: null,
    ip: null,
    device: "",
    splash: true,
    coords: {
      lat: "",
      lng: ""
    },
    isMobile: false,
    badge: {
      internal_mutation: 0,
      external_mutation: 0,
      travel_proposal: 0,
      training_proposal: 0,
      employee_leave_proposal: 0,
      employee_overtime_proposal: 0,
      employee_loan_proposal: 0,
      vacancy_request: 0
    }
  }),
  getters: {
    isAuthenticated: (state: State): boolean =>
      state.token !== null && state.token !== undefined
  }
});
