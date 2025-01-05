import { CityIF, ProvinceIF } from "../../interface/area.interface";

export interface CompanyIF {
  id: string;
  uuid: string;
  logo: string;
  name: string;
  code: string;
  email: string;
  phone_no: string;
  website: string;
  province: ProvinceIF;
  city: CityIF;
  address: string;
  post_code: number;
  logo_decode: string;
}
