import { validate, isErrorOfType, parse } from '@telegram-apps/init-data-node';
import { auth } from '../../config';
import { ValidationStatus } from '../../types/validation-status';

import User from '../../database/model/User';
import _ from 'lodash';

export const enum AccessMode {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
}

export async function getUserData(user: User) {
  const data = _.pick(user, ['_id', 'name', 'roles', 'profilePicUrl']);
  return data;
}

export async function validateTelegramInitData(initData: string) {
  try {
    validate(initData, auth.telegram)
  } catch (e) {
    if (isErrorOfType(e, 'ERR_SIGN_INVALID')) {
      return ValidationStatus.INVALID
    }
    else {
      return ValidationStatus.EXPIRED
    }
  }
  return parse(initData);
}

