import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import ActivityRepo from '../../database/repository/ActivityRepo';
import { Types } from 'mongoose';

const router = express.Router();

router.get(
  '/:id/',
  validator(schema.activityId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const activity = await ActivityRepo.findActivityAllDataById(
      new Types.ObjectId(req.params.id),
    );
    return new SuccessResponse('success', activity).send(res);
  }),
);

export default router;