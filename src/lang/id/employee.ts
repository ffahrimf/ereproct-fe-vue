import { GenericObject } from "../../interface/composable.interface";

const employee: GenericObject = {
  list: {
    title: "Daftar Karyawan",
    search: "Cari",
    add: "Tambah Baru",
    col: {
      no: "No.",
      name: "Karyawan",
      branch: "Cabang",
      division: "Grade",
      class: "Class",
      department: "Department",
      color: "",
      position: "Title",
      contact: "Kontak",
      workPeriod: "Masa Kerja",
      status: "Status",
      action: "Tindakan"
    }
  },
  structure: {
    tab: {
      group: "Group Employee",
      title: "Job Title",
      level: "Job Level",
      grade: "Job Grade",
      class: "Class",
      org: "Organization Structure"
    }
  }
};

export default employee;
