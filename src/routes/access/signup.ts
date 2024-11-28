import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { PublicRequest } from 'app-request';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { AuthFailureError, BadRequestError } from '../../core/ApiError';
import User from '../../database/model/User';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { RoleCode } from '../../database/model/Role';
import { getUserData, validateTelegramInitData } from './utils';
import { ValidationStatus } from '../../types/validation-status';

const router = express.Router();

router.post(
  '/tma',
  validator(schema.signup),
  asyncHandler(async (req: PublicRequest, res) => {
    const rawInitData = req.body.initData;
    const initData = await validateTelegramInitData(rawInitData)
    if (initData === ValidationStatus.INVALID) {
      throw new AuthFailureError('Auth data is invalid');
    }
    if (initData === ValidationStatus.EXPIRED) {
      throw new AuthFailureError('Auth data is expired');
    }
    if (initData.user === undefined) {
      throw new BadRequestError('User is not valid');
    }
    const telegramUser = initData.user;

    const user = await UserRepo.findByTelegram(telegramUser.id);
    if (!user) throw new BadRequestError('User not registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        telegram: telegramUser.id,
        username: telegramUser.username,
        firstname: telegramUser.firstName,
        profilePicUrl:  telegramUser.photoUrl,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      RoleCode.USER,
    );

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey,
    );
    const userData = await getUserData(createdUser);

    new SuccessResponse('Signup Successful', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
