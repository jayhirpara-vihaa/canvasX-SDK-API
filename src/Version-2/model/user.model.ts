import { ARRAY, DATE, INTEGER, SMALLINT, STRING } from 'sequelize';
import dbContext from '../../config/dbContext';

const AppUser = dbContext.define('app_users', {
  id: {
    type: INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: STRING,
  },
  email: {
    type: STRING,
  },
  phone_number: {
    type: STRING,
  },
  country: {
    type: STRING,
  },
  status: {
    type: STRING,
  },
  sdk_key: {
    type: STRING,
  },
  created_date: {
    type: DATE,
  },
  updated_date: {
    type: DATE,
  },
  company_code: {
    type: STRING,
  },
  domains: {
    type: STRING,
  },
  token: {
    type: STRING,
  },
  client_id: {
    type: STRING,
  },
  secret_key: {
    type: STRING,
  },
});

export default AppUser;
