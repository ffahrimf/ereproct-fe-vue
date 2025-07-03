import { ReportIF } from "../views/report/report.interface";
import { ViolationMasterIF } from "../views/violation-master/violation-master.interface";

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

export interface ClientIF {
  id: string;
  uuid: string;
  logo: string;
  code: string;
  name: string;
  email: string;
  phone_no: string;
  website: string;
  province: ProvinceIF;
  city: CityIF;
  logo_decode: string;
}

export interface ParticipantIF {
  id: string;
  uuid: string;
  province: ProvinceIF;
  city: CityIF;
  client: ClientIF;
  name: string;
  email: string;
  phone_no: string;
}

export interface IssueIF {
  id: number;
  uuid: string;
  report: ReportIF;
  participant: ParticipantIF;
  issue_type: string;
  issue_action: string;
  participant_issue_response: string;
  remarks: string;
}

export interface ReportViolationIF {
  id: number;
  uuid: string;
  report: ReportIF;
  participant: ParticipantIF;
  violation_action: string;
  participant_violation_response: string;
  remarks: string;
}

export interface ReportViolationDetailIF {
  id: number;
  uuid: string;
  report_violation: ReportViolationIF;
  violation: ViolationMasterIF;
  period: number;
}
