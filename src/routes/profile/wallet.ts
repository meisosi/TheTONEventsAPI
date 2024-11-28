import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import UserRepo from '../../database/repository/UserRepo';
import { ProtectedRequest } from 'app-request';
import { BadRequestError } from '../../core/ApiError';
import validator from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';
import _ from 'lodash';
import authentication from '../../auth/authentication';
import WalletRepo from '../../database/repository/WalletRepo';

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.post(
  '/',
  validator(schema.connectWallet),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    // Привязка кошелька к пользователю

    const data = _.pick(user, ['ton_wallet']);

    return new SuccessResponse(
      'success',
      data,
    ).send(res);
  }),
);


router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.ton_wallet) throw new BadRequestError('Wallet not connected');

    const wallet = await WalletRepo.findByUserId(user._id);

    const data = _.pick(wallet, ['address', 'provider']);

    return new SuccessResponse(
      'success',
      data,
    ).send(res);
  }),
);

router.delete(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');
    if (!user.ton_wallet) throw new BadRequestError('Wallet not connected');

    user.ton_wallet = undefined;
    await UserRepo.updateInfo(user);

    const data = _.pick(user, ['ton_wallet']);

    return new SuccessResponse(
      'Wallet disconnect',
      data,
    ).send(res);
  }),
);

export default router;
