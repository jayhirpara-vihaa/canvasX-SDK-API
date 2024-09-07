import { Router } from 'express';
import {
  addDomainFn,
  authorizeKeyFn,
  registerFn,
  statusUpdateFn,
} from '../controllers/auth.controller';

export default (app: Router) => {
  app.post('/register', registerFn);
  app.patch('/authorizeKey', authorizeKeyFn);
  app.patch('/status-update/:company_code', statusUpdateFn);
  app.patch('/add-domain/:company_code', addDomainFn);
};
