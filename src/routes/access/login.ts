import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import crypto from 'crypto';
import UserRepo from '../../database/repository/UserRepo';
import { ValidationStatus } from '../../types/validation-status';
import { BadRequestError, AuthFailureError } from '../../core/ApiError';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { createTokens } from '../../auth/authUtils';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import { getUserData, validateTelegramInitData } from './utils';
import { PublicRequest } from '../../types/app-request';

const router = express.Router();

router.post(
  '/tma',
  validator(schema.login),
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

    user.firstname = telegramUser.firstName;
    user.username = telegramUser.username;

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);

    new SuccessResponse('Login Success', {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
);

export default router;
