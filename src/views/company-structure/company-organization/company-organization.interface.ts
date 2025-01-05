import { CompanyIF } from "../../company/company.interface";

export interface CompanyOrganizationIF {
  id: number;
  name: string;
  description: string;
  color: string;
  company_id: number | null;
  company: CompanyIF;
}
