import { CompanyIF } from "../views/company/company.interface";

export interface Coords {
  lat: string;
  lng: string;
}

export interface Badge {
  internal_mutation: number;
  external_mutation: number;
  travel_proposal: number;
  training_proposal: number;
  employee_leave_proposal: number;
  employee_overtime_proposal: number;
  employee_loan_proposal: number;
  vacancy_request: number;
}

export interface State {
  mode: string | undefined;
  token: string | null;
  role: string | null;
  guid: string | null;
  manager: string | null;
  id_table: string | number | null;
  profile: any;
  company: CompanyIF | null;
  permissions: any[];
  placement: any;
  expand: boolean;
  isErr: boolean;
  dataErr: any;
  isOffline: boolean;
  isTimeout: boolean;
  ua: any;
  ip: any;
  device: string;
  splash: boolean;
  coords: Coords;
  isMobile: boolean;
  badge: Badge;
}
