import { RoleIF } from "../../../interface/role.interface";

export interface UserIF {
  id: number;
  username: string;
  name: string;
  email: string;
  email_verified_at?: number;
  roles: RoleIF;
}
