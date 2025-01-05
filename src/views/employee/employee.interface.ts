import {
  CityIF,
  CompanyBranchIF,
  CompanyLevelIF,
  ProvinceIF
} from "../../interface/area.interface";
import { AdminIF } from "../admin/admin.interface";
import { CompanyTitleIF } from "../company-structure/company-title/company-title.interface";
import { CompanyOrganizationIF } from "../company-structure/company-organization/company-organization.interface";
import { CompanyIF } from "../company/company.interface";

export interface EmployeeIF {
  id: number | null;
  uuid: string | null;
  company: CompanyIF;
  user: AdminIF;
  nik: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  birth_date: Date | null;
  gender: string | null;
  start_working: Date | null;
  identity_no: string | null;
  identity_address: string | null;
  identity_province: ProvinceIF | null;
  identity_city: CityIF | null;
  identity_district: string | null;
  identity_village: string | null;
  identity_rtrw: string | null;
  identity_postal_code: string | null;
  current_address: string | null;
  current_province: ProvinceIF | null;
  current_city: CityIF | null;
  current_district: string | null;
  current_village: string | null;
  current_rtrw: string | null;
  current_postal_code: string | null;
  imageDecode: string | null;
  workPeriod: number | null;
  end_working: string | null;
  company_level: CompanyLevelIF | null;
  company_branch: CompanyBranchIF | null;
  company_title: CompanyTitleIF | null;
  company_organization: CompanyOrganizationIF | null;
  is_same_as_identity: boolean;
  photo: string | null;
  thumbnailDecode: string | null;
}

export interface CreateEmployee {
  id?: string;
  uuid?: string;
  photo: File | null;
  company_id: number | null;
  nik: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  birth_date: Date | null;
  gender: string | null;
  start_working: Date | null;
  identity_no: string | null;
  identity_province: number | null;
  identity_city: number | null;
  identity_district: string | null;
  identity_village: string | null;
  identity_rtrw: string | null;
  identity_postal_code: string | null;
  identity_address: string | null;
  current_province: number | null;
  current_city: number | null;
  current_district: string | null;
  current_village: string | null;
  current_rtrw: string | null;
  current_postal_code: string | null;
  current_address: string | null;
  end_working: Date | null;
  company_branch_id: number | null;
  company_organization_id: number | null;
  company_level_id: number | null;
  company_title_id: number | null;
  is_same_as_identity: number | null;
  password: string | null;
}

export interface UpdatePassword {
  id?: string;
  password: string | null;
  conf_password: string | null;
}
