import Activity, { ActivityModel } from '../model/Activity';
import { Types } from 'mongoose';

async function create(activity: Activity): Promise<Activity> {
  const now = new Date();
  activity.createdAt = now;
  activity.updatedAt = now;
  const createdActivity = await ActivityModel.create(activity);
  return createdActivity.toObject();
}

async function update(activity: Activity): Promise<Activity | null> {
  activity.updatedAt = new Date();
  return ActivityModel.findByIdAndUpdate(activity._id, activity, { new: true })
    .lean()
    .exec();
}

async function findActivityAllDataById(id: Types.ObjectId): Promise<Activity | null> {
  return ActivityModel.findOne({ _id: id })
    .select(
      '+organizer +price +isOpen +registrationUrl',
    )
    .lean()
    .exec();
}

async function findActivityScheduleById(id: Types.ObjectId): Promise<Activity | null> {
  return ActivityModel.findOne({ _id: id })
    .select(
      '+schedule',
    )
    .lean()
    .exec();
}

async function findUrlIfExists(activityUrl: string): Promise<Activity | null> {
  return ActivityModel.findOne({ activityUrl: activityUrl }).lean().exec();
}

async function findByTagAndPaginated(
  tag: string,
  pageNumber: number,
  limit: number,
): Promise<Activity[]> {
  return ActivityModel.find({ tags: tag, isPublished: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ updatedAt: -1 })
    .lean()
    .exec();
}

async function findLatestActivities(
  pageNumber: number,
  limit: number,
): Promise<Activity[]> {
  return ActivityModel.find({ status: true, isPublished: true })
    .skip(limit * (pageNumber - 1))
    .limit(limit)
    .sort({ publishedAt: -1 })
    .lean()
    .exec();
}

async function searchSimilarActivities(activity: Activity, limit: number): Promise<Activity[]> {
  return ActivityModel.find(
    {
      $text: { $search: activity.title, $caseSensitive: false },
      status: true,
      isPublished: true,
      _id: { $ne: activity._id },
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .sort({ updatedAt: -1 })
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function search(query: string, limit: number): Promise<Activity[]> {
  return ActivityModel.find(
    {
      $text: { $search: query, $caseSensitive: false },
      status: true,
      isPublished: true,
    },
    {
      similarity: { $meta: 'textScore' },
    },
  )
    .select('-status -description')
    .limit(limit)
    .sort({ similarity: { $meta: 'textScore' } })
    .lean()
    .exec();
}

async function searchLike(query: string, limit: number): Promise<Activity[]> {
  return ActivityModel.find({
    title: { $regex: `.*${query}.*`, $options: 'i' },
    status: true,
    isPublished: true,
  })
    .select('-description')
    .limit(limit)
    .sort({ score: -1 })
    .lean()
    .exec();
}

export default {
  create,
  update,
  findActivityAllDataById,
  findActivityScheduleById,
  findUrlIfExists,
  findByTagAndPaginated,
  findLatestActivities,
  searchSimilarActivities,
  search,
  searchLike,
};
