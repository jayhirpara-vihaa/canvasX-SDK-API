import { Request } from 'express';
import {
  getLocalDate,
  prepareMessageFromParams,
  resBadRequest,
  resNotFound,
  resSuccess,
} from '../utils/shared-functions';
import AppUser from '../model/user.model';
import {
  DATA_ALREADY_EXITE,
  ERROR_NOT_FOUND,
  API_KEY_ERROR_MESSAGE,
  DUPLICATE_VALUE_ERROR_MESSAGE,
} from '../utils/app-messages';
import { ActiveStatus, UserType } from '../utils/app-enumeration';
import { createUserJWT, verifyJWT } from '../helpers/jwt.helper';
const crypto = require('crypto');
const fs = require('fs');
import path from 'path';

export const registerUser = async (req: Request) => {
  try {
    const { name, email, phone_number, country, company_code } = req.body;

    const sdk_key = crypto.randomBytes(20).toString('hex');

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
      sdk_key,
      created_date: getLocalDate(),
      status: ActiveStatus.Active,
    });

    return resSuccess({ data: newUser });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const authorizeKey = async (req: Request) => {
  try {
    const { sdk_key } = req.body;
    const origin = req.get('origin');
    console.log(origin);
    const user = await AppUser.findOne({
      where: {
        sdk_key,
      },
    });

    if (!(user && user.dataValues)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'User']]),
      });
    }

    const jwtToken = {
      company_code: user.dataValues.company_code,
      domains: user.dataValues.domains.split(','),
    };

    const data = createUserJWT(user.dataValues.id, jwtToken, UserType.Contact);

    const verify = await verifyJWT(data.token);

    const domains = user.dataValues.domains || '';

    if (!domains.split(',').includes(origin)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'Domain']]),
        data: { ...data, data: verify },
      });
    }

    if (user.dataValues.status === ActiveStatus.Inactive) {
      return resBadRequest({ message: API_KEY_ERROR_MESSAGE });
    }

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

export const test = async (req: Request) => {
  const { read = false } = req.body;

  if (read) {
    fs.readFile('example.txt', 'utf8', (err: any, data: any) => {
      if (err) {
        return resSuccess({ message: 'Error reading the file:', data: err });
      } else {
        return resSuccess({ data });
      }
    });
  } else {
    const data = 'This is a test file.';

    fs.writeFile('example.txt', data, (err: any) => {
      if (err) {
        return resSuccess({ message: 'Error writing to file:', data: err });
      } else {
        return resSuccess({ message: 'File has been written successfully!' });
      }
    });
  }
};
