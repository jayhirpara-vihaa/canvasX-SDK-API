import { Request } from 'express';
import {
  getLocalDate,
  prepareMessageFromParams,
  resBadRequest,
  resNotFound,
  resSuccess,
} from '../utils/shared-functions';
import AppUser from '../model/user.model';
import { DATA_ALREADY_EXITE, ERROR_NOT_FOUND, API_KEY_ERROR_MESSAGE } from '../utils/app-messages';
import { ActiveStatus } from '../utils/app-enumeration';
import { Sequelize } from 'sequelize';
const crypto = require('crypto');
const os = require('os');

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
        sdk_key: sdk_key,
      },
    });

    if (!(user && user.dataValues)) {
      return resNotFound({
        message: prepareMessageFromParams(ERROR_NOT_FOUND, [['field_name', 'User']]),
      });
    }

    if (user.dataValues.status === ActiveStatus.Inactive) {
      return resBadRequest({ message: API_KEY_ERROR_MESSAGE });
    }

    await AppUser.update(
      {
        domains: user.dataValues.domains
          ? user.dataValues.domains.includes(origin)
            ? user.dataValues.domains
            : Sequelize.fn('array_append', Sequelize.col('domains'), origin)
          : [origin], // If no domains exist, start a new array with `origin`
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
