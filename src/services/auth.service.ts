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
import { ActiveStatus } from '../utils/app-enumeration';
const crypto = require('crypto');

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

    const domains = user.dataValues.domains || '';

    if (!domains.split(',').includes(origin)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'Domain']]),
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
