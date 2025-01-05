import { AdminIF } from "../views/admin/admin.interface";
import { CompanyIF } from "../views/company/company.interface";

export interface ProvinceIF {
  id: number;
  uuid: string;
  name: string;
}

export interface CityIF {
  id: number;
  uuid: string;
  name: string;
  province: ProvinceIF;
}

export interface CompanyLevelIF {
  id: number;
  name: string;
  company: CompanyIF;
}

export interface AttendanceScheduleIF {
  id: number;
  name: string;
  company: CompanyIF;
}
export interface AttendanceEmployeeIF {
  id: number;
  user: AdminIF;
  attendance_schedule: AttendanceScheduleIF;
}

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
