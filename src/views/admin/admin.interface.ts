import { RoleIF } from "../../interface/role.interface";
import { CompanyIF } from "../company/company.interface";

export interface AdminIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  username: string;
  name: string;
  email: string;
  email_verified_at?: number;
  password: string;
  role: RoleIF;
}
