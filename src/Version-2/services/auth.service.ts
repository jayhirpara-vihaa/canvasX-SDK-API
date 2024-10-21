import { Request } from 'express';
import {
  getLocalDate,
  prepareMessageFromParams,
  resBadRequest,
  resNotFound,
  resSuccess,
} from '../../utils/shared-functions';
import AppUser from '../model/user.model';
import {
  DATA_ALREADY_EXITE,
  ERROR_NOT_FOUND,
  API_KEY_ERROR_MESSAGE,
  DUPLICATE_VALUE_ERROR_MESSAGE,
} from '../../utils/app-messages';
import { ActiveStatus, UserType } from '../../utils/app-enumeration';
import { createUserJWT, verifyJWT } from '../../helpers/jwt.helper';
const crypto = require('crypto');

const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';

function generateKey(length: number) {
  let key = '';
  const charsetLength = charset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomBytes(1)[0] % charsetLength;
    key += charset[randomIndex];
  }

  return key;
}

export const registerUser = async (req: Request) => {
  try {
    const { name, email, phone_number, country, company_code } = req.body;
    const publicKey = generateKey(80);
    const privateKey = generateKey(80);

    const user = await AppUser.findOne({
      where: {
        company_code: company_code,
      },
    });

    if (user && user.dataValues) {
      return resBadRequest({
        message: prepareMessageFromParams(DATA_ALREADY_EXITE, [['field_name', 'User']]),
        data: user.dataValues.sdk_key,
      });
    }

    const newUser = await AppUser.create({
      name,
      email,
      phone_number,
      country,
      company_code,
      sdk_key: '',
      created_date: getLocalDate(),
      status: ActiveStatus.Active,
      client_id: publicKey,
      secret_key: privateKey,
    });

    return resSuccess({ data: newUser });
  } catch (error) {
    throw error;
  }
};

export const authorizeKey = async (req: Request) => {
  try {
    const { client_id, secret_key } = req.body;

    const origin = req.get('origin');

    const user = await AppUser.findOne({
      where: {
        client_id,
        secret_key,
      },
    });

    if (!(user && user.dataValues)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'User']]),
      });
    }
    const domains = user.dataValues.domains || '';

    if (!domains.split(',').includes(origin)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'Domain']]),
      });
    }

    if (user.dataValues.status === ActiveStatus.Inactive) {
      return resBadRequest({ message: API_KEY_ERROR_MESSAGE });
    }

    const jwtPayload = {
      id: user.dataValues.id,
      client_id: user.dataValues.client_id,
      secret_key: user.dataValues.secret_key,
      company_code: user.dataValues.company_code,
    };

    const data = await createUserJWT(user.dataValues.id, jwtPayload, UserType.Contact);

    await AppUser.update(
      {
        token: data.token,
      },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );

    return resSuccess();
  } catch (error) {
    throw error;
  }
};

export const statusUpdate = async (req: Request) => {
  try {
    const { company_code } = req.params;

    const user = await AppUser.findOne({
      where: {
        company_code,
      },
    });

    if (!(user && user.dataValues)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'User']]),
      });
    }

    switch (user.dataValues.status) {
      case ActiveStatus.Active:
        await AppUser.update(
          {
            status: ActiveStatus.Inactive,
          },
          {
            where: {
              id: user.dataValues.id,
            },
          }
        );
        break;

      case ActiveStatus.Inactive:
        await AppUser.update(
          {
            status: ActiveStatus.Active,
          },
          {
            where: {
              id: user.dataValues.id,
            },
          }
        );
        break;

      default:
        break;
    }

    return resSuccess();
  } catch (error) {
    throw error;
  }
};
export const addDomain = async (req: Request) => {
  try {
    const { domain } = req.body;
    const { company_code } = req.params;
    const user = await AppUser.findOne({
      where: {
        company_code: company_code,
      },
    });

    if (!user) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'User']]),
      });
    }

    const domains = user.dataValues.domains || '';
    if (domains && domains.split(',').includes(domain)) {
      return resBadRequest({
        message: prepareMessageFromParams(DUPLICATE_VALUE_ERROR_MESSAGE, [
          ['field_name', 'Domain'],
        ]),
      });
    }

    await AppUser.update(
      {
        domains: domains.length > 0 ? domains + ',' + domain : domain,
      },
      {
        where: {
          id: user.dataValues.id,
        },
      }
    );

    return resSuccess();
  } catch (error) {
    throw error;
  }
};

export const verifyToken = async (req: Request) => {
  try {
    const { token } = req.body;

    const verify = await verifyJWT(token);

    return resSuccess({ data: verify });
  } catch (error) {}
};
