import { RoleIF } from "../../interface/role.interface";

export interface AdminIF {
  id: number;
  uuid: string;
  username: string;
  name: string;
  email: string;
  email_verified_at?: number;
  password: string;
  role: RoleIF;
}
