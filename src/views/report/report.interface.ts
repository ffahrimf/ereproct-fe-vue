import { EventIF } from "../event/event.interface";
import { ProctorIF } from "../stakeholder/proctor/proctor.interface";

export interface ReportIF {
  id?: number | null;
  uuid: string;
  event: EventIF;
  proctor: ProctorIF;
  // number_of_participants: number;
  number_of_participants_logged_in: number;
  number_of_participants_only_logged_in: number;
  // number_of_participants_not_logged_in: number;
  number_of_participants_completed: number;
  number_of_participants_not_completed: number;
  status: "SCHEDULED" | "DECLINED" | "ON DUTY" | "REVIEW" | "COMPLETED";
  note: string;
}
