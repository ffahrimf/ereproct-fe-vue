import { reactive } from "vue";
import { CreateEmployee } from "../employee.interface";
import {
  company_branch,
  company_organization,
  company_level,
  company_title,
  identity_province,
  identity_city,
  current_province,
  current_city,
  usePhotoStore
} from "../select";

const photoStore = usePhotoStore();

export const errs: { [key: string]: string } = reactive({});

export const setupErrVar = () => {
  for (let key in form) {
    errs[key] = "";
  }
};

export const resetErrVar = () => {
  for (let key in errs) {
    errs[key] = "";
  }
};

export const form = reactive<Partial<CreateEmployee>>({
  id: "",
  photo: null,
  company_id: null,
  nik: "",
  name: "",
  email: "",
  phone_number: "",
  birth_date: null,
  gender: "",
  start_working: null,
  identity_no: "",
  identity_province: null,
  identity_city: null,
  identity_district: "",
  identity_village: "",
  identity_rtrw: "",
  identity_postal_code: "",
  identity_address: "",
  current_province: null,
  current_city: null,
  current_district: "",
  current_village: "",
  current_rtrw: "",
  current_postal_code: "",
  current_address: "",
  end_working: null,
  company_branch_id: null,
  company_organization_id: null,
  company_level_id: null,
  company_title_id: null,
  is_same_as_identity: null,
  password: ""
});

export const resetForm = () => {
  form.id = "";
  form.photo = null;
  form.company_id = null;
  form.nik = "";
  form.name = "";
  form.email = "";
  form.phone_number = "";
  form.birth_date = null;
  form.gender = "";
  form.start_working = null;
  form.identity_no = "";
  identity_province.selected = null;
  form.identity_province = null;
  identity_city.selected = null;
  form.identity_city = null;
  form.identity_district = "";
  form.identity_village = "";
  form.identity_rtrw = "";
  form.identity_postal_code = "";
  form.identity_address = "";
  current_province.selected = null;
  form.current_province = null;
  current_city.selected = null;
  form.current_city = null;
  form.current_district = "";
  form.current_village = "";
  form.current_rtrw = "";
  form.current_postal_code = "";
  form.current_address = "";
  form.end_working = null;
  company_branch.selected = null;
  company_organization.selected = null;
  company_level.selected = null;
  company_title.selected = null;
  form.is_same_as_identity = null;
  form.password = "";
  photoStore.resetPhotoPreview();
  resetErrVar();
};
