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

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
  '/',
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    return new SuccessResponse(
      'success',
      _.pick(user, ['firstname', 'ton_wallet', 'activities']),
    ).send(res);
  }),
);

router.put(
  '/',
  validator(schema.updateProfile),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError('User not registered');

    if (req.body.firstname) user.firstname = req.body.firstname;
    if (req.body.profilePicUrl) user.profilePicUrl = req.body.profilePicUrl;

    await UserRepo.updateInfo(user);

    const data = _.pick(user, ['firstname', 'profilePicUrl']);

    return new SuccessResponse('Profile updated', data).send(res);
  }),
);

export default router;
