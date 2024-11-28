import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  userId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  updateProfile: Joi.object().keys({
    firstname: Joi.string().min(1).max(200).optional(),
    usernames: Joi.string().min(3).max(200).optional(),
    photoUrl: Joi.string().uri().optional(),
  }),
  connectWallet: Joi.object().keys({
    address: Joi.string(),
    provider: Joi.string()
  }),
};
