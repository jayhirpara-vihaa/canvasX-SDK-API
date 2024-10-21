import fs from "fs";
import path from "path";
import { ITokenExpiredTime } from "../data/interfaces/jwt/jwt.interface";
import { TUserType } from "../data/types/common/common.type";
import { UserType, VehicleCategory, VehicleColor, VehicleSeat, vehicleStatus } from "./app-enumeration";

// Region REQUEST RESPONSE CODER
export const SIGNATURE_ALGORITHM = "sha1WithRSAEncryption";

export const CIPHER_ALGORITHM = "aes-128-cbc";

export const PUBLIC_KEY = 'PUBLIC_KEY';
export const PRIVATE_KEY = 'PRIVATE_KEY';
// End Region

// Region JWT
export const JWT_SECRET_KEY = "JWT_SECRET_KEY";

export const USER_JWT_EXPIRATION_TIME = {
  [UserType.Administrator]: { tokenTime: 86400, refreshTokenTime: 86400 * 2 },
  [UserType.Affiliate]: { tokenTime: 86400, refreshTokenTime: 86400 * 2 },
  [UserType.Contact]: { tokenTime: "30d", refreshTokenTime: "30d" },
};

export const JWT_EXPIRED_ERROR_NAME = "TokenExpiredError";
export const JWT_EXPIRED_ERROR_MESSAGES = {
  invalidToken: "invalid token",
  jwtMalformed: "jwt malformed",
  jwtSignatureIsRequired: "jwt signature is required",
  jwtAudienceInvalid: "jwt audience invalid",
  jwtIssuerInvalid: "jwt issuer invalid",
  jwtIdInvalid: "jwt id invalid",
  jwtSubjectInvalid: "jwt subject invalid",
}
// End Region

export const PASSORD_SOLT = 10;

export const PASSWORD_REGEX =
  /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])[a-zA-Z0-9@$!%*#?&]+/g;
  
export const PHONE_NUMBER_REGEX = /^[+]{1}(?:[0-9\-\\(\\)\\/.]\s?){6,15}[0-9]{1}$/;

export const USER_TYPE_LIST = Object.keys(UserType)
  .filter((key) => isNaN(Number(key)))
  .map((key) => UserType[key as keyof typeof UserType]);

export const VEHICLE_CATEGORY_LIST = Object.keys(VehicleCategory)
  .filter((key) => isNaN(Number(key)))
  .map((key) => VehicleCategory[key as keyof typeof VehicleCategory]);

export const VEHICLE_COLOR_LIST = Object.keys(VehicleColor)
  .filter((key) => isNaN(Number(key)))
  .map((key) => VehicleColor[key as keyof typeof VehicleColor]);

export const VEHICLE_SEAT_LIST = Object.keys(VehicleSeat)
  .filter((key) => isNaN(Number(key)))
  .map((key) => VehicleSeat[key as keyof typeof VehicleSeat]);

export const VEHICLE_STATUS_LIST = Object.keys(vehicleStatus)
  .filter((key) => isNaN(Number(key)))
  .map((key) => vehicleStatus[key as keyof typeof vehicleStatus]);
export const BIT_FIELD_VALUES = ["0", "1"];