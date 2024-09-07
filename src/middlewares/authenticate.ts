import { Request, RequestHandler, Response } from "express";
import { verifyJWT } from "../helpers/jwt.helper";
import { JWT_EXPIRED_ERROR_NAME } from "../utils/app-constants";
import {
  DEFAULT_STATUS_CODE_ERROR,
  UNAUTHORIZED_ACCESS_CODE,
  BAD_REQUEST_CODE,
  DEFAULT_STATUS_CODE_SUCCESS,
  AUTHORIZATION_TOKEN_IS_REQUIRED,
} from "../utils/app-messages";
import {
  resBadRequest,
  resUnauthorizedAccess,
  resUnknownError,
} from "../utils/shared-functions";

export const publicAuthentication: RequestHandler = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(BAD_REQUEST_CODE)
      .send(resBadRequest({ message: AUTHORIZATION_TOKEN_IS_REQUIRED }));
  }
  if (req.headers.authorization === "key") {
    return next();
  }
  return res.status(UNAUTHORIZED_ACCESS_CODE).send(resUnauthorizedAccess());
};

export const verifyAuthorizationToken = async (req: Request, res: Response) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(BAD_REQUEST_CODE)
        .send(resBadRequest({ message: AUTHORIZATION_TOKEN_IS_REQUIRED }));
    }
    const result = await verifyJWT(req.headers.authorization);
    if (result.code === DEFAULT_STATUS_CODE_SUCCESS) {
      return result.data;
    } else if (
      result.code === UNAUTHORIZED_ACCESS_CODE &&
      result.message === JWT_EXPIRED_ERROR_NAME
    ) {
      return res.status(result.code).send(result);
    }
    return res.status(DEFAULT_STATUS_CODE_ERROR).send(resUnknownError());
  } catch (e) {
    return res
      .status(DEFAULT_STATUS_CODE_ERROR)
      .send(resUnknownError({ data: e }));
  }
};

export const authentication: RequestHandler = async (req, res, next) => {
  const data = await verifyAuthorizationToken(req, res);
  if (!res.headersSent) {
    return next();
  }
};
