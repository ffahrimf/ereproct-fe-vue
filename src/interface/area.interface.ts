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
