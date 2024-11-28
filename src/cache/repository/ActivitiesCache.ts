import { getListRange, setList } from '../query';
import Activity from '../../database/model/Activity';
import { DynamicKey, getDynamicKey } from '../keys';
import { addMillisToCurrentDate } from '../../helpers/utils';
import { caching } from '../../config';
import { Types } from 'mongoose';

function getKeyForSimilar(activityId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.ACTIVITIES_SIMILAR, activityId.toHexString());
}

async function saveSimilarActivities(activityId: Types.ObjectId, activities: Activity[]) {
  return setList(
    getKeyForSimilar(activityId),
    activities,
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchSimilarActivities(activityId: Types.ObjectId) {
  return getListRange<Activity>(getKeyForSimilar(activityId));
}

export default {
  saveSimilarActivities,
  fetchSimilarActivities,
};
