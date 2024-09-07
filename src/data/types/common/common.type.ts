export type TUserType = 1 | 2 | 3;

export type TResponse = (payload?: {
  code?: number;
  status?: string;
  message?: string;
  data?: any;
}) => {
  code: number;
  status: string;
  message: string;
  data: any;
};

export type TDataExitResponse = (payload?: {
  code?: number;
  status?: string;
  message?: any;
  data?: any;
}) => {
  code: number;
  status: string;
  message: string;
  data: any;
};

export interface ISaveAddressPayload {
  street_address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

export interface ISavecontactUserPayload {
  name: string;
  email: string;
  phone_number: string;
}

export interface ISaveVehiclePayload {
  category: number;
  passenger_count: string;
  color: string;
  seat_fabric: number;
  status: number;
}
