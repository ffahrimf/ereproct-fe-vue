import { CityIF, ProvinceIF } from "../../interface/area.interface";
import { CompanyIF } from "../company/company.interface";

export interface CompanyBranchIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  name: string;
  email: string;
  email_verified_at?: number;
  phone_no: string;
  website: string;
  province: ProvinceIF;
  city: CityIF;
  address: string;
  post_code: string;
}
