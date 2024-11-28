import { getJson, setJson } from '../query';
import { Types } from 'mongoose';
import Activity from '../../database/model/Activity';
import { DynamicKey, getDynamicKey } from '../keys';
import { caching } from '../../config';
import { addMillisToCurrentDate } from '../../helpers/utils';

function getKeyForId(activityId: Types.ObjectId) {
  return getDynamicKey(DynamicKey.ACTIVITY, activityId.toHexString());
}

function getKeyForUrl(activityUrl: string) {
  return getDynamicKey(DynamicKey.ACTIVITY, activityUrl);
}

async function save(activity: Activity) {
  return setJson(
    getKeyForId(activity._id),
    { ...activity },
    addMillisToCurrentDate(caching.contentCacheDuration),
  );
}

async function fetchById(activityId: Types.ObjectId) {
  return getJson<Activity>(getKeyForId(activityId));
}

async function fetchByUrl(activityUrl: string) {
  return getJson<Activity>(getKeyForUrl(activityUrl));
}

export default {
  save,
  fetchById,
  fetchByUrl,
};
