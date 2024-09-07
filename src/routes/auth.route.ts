import { Router } from 'express';
import { authorizeKeyFn, registerFn, statusUpdateFn } from '../controllers/auth.controller';

export default (app: Router) => {
  app.post('/register', registerFn);
  app.patch('/authorizeKey', authorizeKeyFn);
  app.patch('/status-update/:company_code', statusUpdateFn);
};
