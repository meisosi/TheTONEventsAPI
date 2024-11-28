import express from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { BadRequestError } from '../../core/ApiError';
import ActivityRepo from '../../database/repository/ActivityRepo';
import { Types } from 'mongoose';
import ActivitiesCache from '../../cache/repository/ActivitiesCache';

const router = express.Router();

router.get(
  '/latest',
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const activities = await ActivityRepo.findLatestActivities(
      parseInt(req.query.page as string), 
      parseInt(req.query.limit as string)
    );
    return new SuccessResponse('success', activities).send(res);
  }),
);

router.get(
  '/tag/:tag',
  validator(schema.activityTag, ValidationSource.PARAM),
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const activities = await ActivityRepo.findByTagAndPaginated(
      req.params.tag,
      parseInt(req.query.page as string),
      parseInt(req.query.limit as string),
    );
    return new SuccessResponse('success', activities).send(res);
  }),
);

router.get(
  '/similar/:id',
  validator(schema.activityId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const activityId = new Types.ObjectId(req.params.id);
    let activities = await ActivitiesCache.fetchSimilarActivities(activityId);

    if (!activities) {
      const activity = await ActivityRepo.findActivityAllDataById(activityId);
      if (!activity) throw new BadRequestError('Activities is not available');
      activities = await ActivityRepo.searchSimilarActivities(activity, 6);

      if (activities && activities.length > 0)
        await ActivitiesCache.saveSimilarActivities(activityId, activities);
    }

    return new SuccessResponse('success', activities ? activities : []).send(res);
  }),
);

export default router;
