import { RequestHandler } from 'express';
import { addDomain, authorizeKey, registerUser, statusUpdate, test } from '../services/auth.service';
import { callServiceMethod } from './base.controller';

export const registerFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, registerUser(req), 'registerSystemUserFn');
};

export const authorizeKeyFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, authorizeKey(req), 'authorizeKeyFn');
};

export const statusUpdateFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, statusUpdate(req), 'statusUpdateFn');
};

export const addDomainFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, addDomain(req), 'addDomainFn');
};

export const testFn: RequestHandler = (req, res) => {
  callServiceMethod(req, res, test(req), "testFn")
}