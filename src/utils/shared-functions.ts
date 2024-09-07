import axios from "axios";
import { TDataExitResponse, TResponse } from "../data/types/common/common.type";
import {
  BAD_REQUEST_CODE,
  BAD_REQUEST_MESSAGE,
  DATA_ALREADY_EXITE,
  DEFAULT_STATUS_CODE_ERROR,
  DEFAULT_STATUS_CODE_SUCCESS,
  DEFAULT_STATUS_ERROR,
  DEFAULT_STATUS_SUCCESS,
  NOT_FOUND_CODE,
  NOT_FOUND_MESSAGE,
  UNAUTHORIZED_ACCESS_CODE,
  API_KEY_ERROR_MESSAGE,
  UNKNOWN_ERROR_TRY_AGAIN,
} from "./app-messages";

export const parseData = (data: Object) => {
  try {
    var info = JSON.stringify(data);
    if (String(info) === "{}") {
      info = String(data);
    }
    return info;
  } catch {
    return String(data);
  }
};

export const resSuccess: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_SUCCESS,
    status: payload?.status || DEFAULT_STATUS_SUCCESS,
    message: payload?.message || DEFAULT_STATUS_SUCCESS,
    data: payload?.data || null,
  };
};

export const resUnauthorizedAccess: TResponse = (payload) => {
  return {
    code: payload?.code || UNAUTHORIZED_ACCESS_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || API_KEY_ERROR_MESSAGE,
    data: payload?.data || null,
  };
};

export const resUnknownError: TResponse = (payload) => {
  return {
    code: payload?.code || DEFAULT_STATUS_CODE_ERROR,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || UNKNOWN_ERROR_TRY_AGAIN,
    data: payload?.data || null,
  };
};

export const resBadRequest: TResponse = (payload) => {
  return {
    code: payload?.code || BAD_REQUEST_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || BAD_REQUEST_MESSAGE,
    data: payload?.data || null,
  };
};

export const resNotFound: TResponse = (payload) => {
  return {
    code: payload?.code || NOT_FOUND_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: payload?.message || NOT_FOUND_MESSAGE,
    data: payload?.data || null,
  };
};

export const resErrorDataExit: TDataExitResponse = (payload) => {
  return {
    code: payload?.code || BAD_REQUEST_CODE,
    status: payload?.status || DEFAULT_STATUS_ERROR,
    message: prepareMessageFromParams(DATA_ALREADY_EXITE, [["field_name", payload?.message]]) || prepareMessageFromParams(DATA_ALREADY_EXITE, [["field_name", "Data"]]),
    data: payload?.data || null,
  };
};

export const getLocalDate = () => {
  return new Date();
};

export const getLogSaveDateFormat = (date: Date) => {
  return {
    date: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
    time: `${date.getHours()}00`,
  };
};

export const genrerateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};


export const prepareMessageFromParams = (
  message: string,
  params: [string, string][]
) => {
  let resultMessage = message;
  for (const [key, value] of params) {
    resultMessage = resultMessage.replace(
      new RegExp("<<" + key + ">>", "g"),
      value
    );
  }
  return resultMessage;
};
