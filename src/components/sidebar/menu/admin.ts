import { ref } from "vue";
import { MenuIF } from "./menu.interface";

const admin = ref<MenuIF[]>([
  {
    name: "Dashboard",
    icon: "squares-2X2",
    permission: "all",
    path: "/",
    sub: [],
    toggle: false
  },
  {
    name: "Company",
    icon: "briefcase",
    permission: "all",
    path: "",
    sub: [
      {
        name: "Admin Management",
        permission: "manage_admin",
        path: "/admin"
      },
      {
        name: "Company Branch",
        path: "/company-branch"
      },

      {
        name: "Company Structure",
        path: "/company-structure/organization"
      }
    ],
    toggle: false
  },
  {
    name: "Attendance",
    icon: "calendar",
    permission: "manage_attendance",
    path: "",
    sub: [
      {
        name: "Attendance Summary",
        path: "/attendance/summary"
      },
      {
        name: "Attendance Shift",
        path: "/attendance/shift"
      },
      {
        name: "Attendance Location Setting",
        path: "/attendance/location-setting"
      },
      {
        name: "Kehadiran Harian",
        path: "/attendance-perday"
      },
      {
        name: "Shifting Plan",
        path: "/shifting-plan"
      },
      {
        name: "Geofence Setting",
        path: "/geofence"
      },
      {
        name: "Holiday Setting",
        path: "/holiday"
      }
    ],
    toggle: false
  },
  {
    name: "Employee",
    icon: "users",
    permission: "all",
    path: "",
    sub: [
      {
        name: "Employee List",
        permission: "manage_employee",
        path: "/employee-list"
      },
      {
        name: "Employe Kontrak",
        path: "/contract"
      },
      {
        name: "Termination",
        path: "/terminate"
      }
    ],
    toggle: false
  },
  {
    name: "Leave",
    icon: "account-clock-outline",
    permission: "manage_leave",
    "icon-type": "mdi",
    path: "",
    sub: [
      {
        name: "Leave Management",
        path: "/leave-master"
      },
      {
        name: "Leave Type",
        path: "/leave/type"
      },
      {
        name: "Employee Leave",
        path: "/leave/employee"
      }
    ],
    toggle: false
  }
]);

export default admin;
