import Joi from 'joi';
import { JoiObjectId } from '../../helpers/validator';

export default {
  activityId: Joi.object().keys({
    id: JoiObjectId().required(),
  }),
  activityTag: Joi.object().keys({
    tag: Joi.string().required(),
  }),
  pagination: Joi.object().keys({
    page: Joi.number().required().integer().min(1),
    limit: Joi.number().required().integer().min(1),
  }),
};
