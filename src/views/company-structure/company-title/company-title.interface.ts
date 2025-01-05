import { CompanyIF } from "../../company/company.interface";

export interface CompanyTitleIF {
  id: number;
  uuid: string;
  company: CompanyIF;
  name: string;
  description: string;
}
