export interface IGetRostelecomOfficeByCity {
  city: string;
  lang?: "ru" | "en";
}

export interface IGetRostelecomOfficeByCityResponse {
  data: IRostelecomOfficeByCity;
}

export interface IRostelecomOfficeByCity {
  results: IRostelecomOfficeByCityData[];
}

export interface IRostelecomOfficeByCityData {
  address_line1: string;
  address_line2: string;
  city: string;
  place_id: string;
  bbox: IBbox;
  lat: number;
  lon: number;
}

export interface IBbox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

export interface IUserGeolacation {
  features: IUserGeolacationData[];
}

export interface IUserGeolacationData {
  bbox: [number, number, number, number];
  properties: {
    city: string;
    lon: number;
    lat: number;
  };
}

export interface IGetGeolocationUser {
  lat: number;
  lon: number;
}

export type handlerSelectAdress = {
  position: IGetGeolocationUser;
  box: IBbox;
  initialMapInstance?: any;
};

export interface IHandleLoadMap {
  searchVelue?: string;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  marker?: boolean;
}
