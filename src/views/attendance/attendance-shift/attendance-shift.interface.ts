import { CompanyIF } from "../../company/company.interface";

export interface AttendanceShiftIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  code: string;
  name: string;
  shift_in: string;
  shift_out: string;
  is_overnight: boolean;
  status: boolean;
  detail?: string;
  buffer_in?: string;
  buffer_out?: string;
  grace_checkin?: string;
}
