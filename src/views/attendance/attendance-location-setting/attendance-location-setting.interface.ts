import { CompanyIF } from "../../company/company.interface";
import { CompanyBranchIF } from "../../company-branch/company-branch.interface";

export interface AttendanceLocationSettingIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  company_branch: CompanyBranchIF;
  longitude: string;
  latitude: string;
  radius?: string;
  status: boolean;
}
