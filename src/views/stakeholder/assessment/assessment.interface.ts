import { UserIF } from "../../user/user.interface";

export interface AssessmentIF {
  id: number;
  uuid: string;
  name: string;
  email: string;
  user: UserIF;
  phone_number: string;
  birth_date: string;
  gender: string;
  status: boolean;
  file: string;
  thumbnailDecode: string;
}
