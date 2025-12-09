require('dotenv').config({ path: '.env' });

export const PORT = process.env.PORT || 2526;
export const SECURE_COMMUNICATION = process.env.SECURE_COMMUNICATION
  ? process.env.SECURE_COMMUNICATION === 'true'
  : false || false;

export const DB_NAME = process.env.DB_NAME || 'canvasx';
export const DB_USER_NAME = process.env.DB_USER_NAME || 'postgres';
export const DB_PASSWORD = process.env.DB_PASSWORD || 'CGELM5BOdRsfZMhleEVz';
export const DB_HOST = process.env.DB_HOST || 'tccprod.cv2m8y2m8sbl.ap-south-1.rds.amazonaws.com';
export const DB_PORT = process.env.DB_PORT || 5432;
export const SEQUELIZE_DIALECT = process.env.SEQUELIZE_DIALECT || 'postgres';
