import { ClientIF, ParticipantIF } from "../../interface/area.interface";

export interface EventIF {
  id: number;
  uuid: string;
  client: ClientIF;
  code: string;
  date: string;
  start_time: string;
  finish_time: string;
  status: "PENDING" | "SCHEDULED" | "COMPLETED";
  eventDetails: EventDetailIF[];
}

export interface EventDetailIF {
  id: number;
  uuid: string;
  event: EventIF;
  participant: ParticipantIF;
}
