import { CompanyIF } from "../../company/company.interface";

export interface CompanyLevelIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  name: string;
  description: string;
}
