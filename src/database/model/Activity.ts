import { Schema, model, Types } from 'mongoose';
import User from './User';
import { Schedule } from '../../types/schedule';
import { Address } from '../../types/address';

export const DOCUMENT_NAME = 'Activity';
export const COLLECTION_NAME = 'activities';

export default interface Activity {
  _id: Types.ObjectId;
  title: string;
  slogan?: string;
  description: string;
  schedule?: Schedule[];
  tags: string[];
  organizer: User;
  admins: User[];
  imgUrl?: string;
  activityUrl: string;
  address?: Address;
  price?: number;
  isOpen?: boolean;
  registrationUrl?: string;
  startAt?: Date;
  endAt?: Date;
  createdBy?: User;
  updatedBy?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Activity>(
  {
    title: {
      type: Schema.Types.String,
      required: true,
      maxlength: 500,
      trim: true,
    },
    slogan: {
      type: Schema.Types.String,
      required: false,
      maxlength: 200,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      select: false,
      maxlength: 5000,
    },
    schedule: {
      type: [
        {
          timeStart: {
            type: Schema.Types.Date,
            required: true,
          },
          timeEnd: {
            type: Schema.Types.Date,
            required: true,
          },
          action: {
            type: Schema.Types.String,
            required: true,
          },
        },
      ],
      required: true,
      select: false,
    },
    tags: [
      {
        type: Schema.Types.String,
        trim: true,
        uppercase: true,
      },
    ],
    organizer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imgUrl: {
      type: Schema.Types.String,
      required: false,
      maxlength: 500,
      trim: true,
    },
    activityUrl: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      maxlength: 200,
      trim: true,
    },
    address: {
      type: {
        country: {
          type: Schema.Types.String,
          required: true,
          trim: true,
          maxlength: 50,
        },
        city: {
          type: Schema.Types.String,
          required: false,
          trim: true,
          maxlength: 50,
        },
        street: {
          type: Schema.Types.String,
          required: false,
          maxlength: 100,
        },
        building: {
          type: Schema.Types.String,
          required: false,
          maxlength: 50,
        },
        additional: {
          type: Schema.Types.String,
          required: false,
          maxlength: 100,
        },
      }
    },
    price: {
      type: Schema.Types.Number,
      default: 0,
      select: false,
    },
    isOpen: {
      type: Schema.Types.Boolean,
      default: true,
      select: false,
      index: true,
    },
    registrationUrl: {
      type: Schema.Types.String,
      required: false,
      select: false,
    },
    startAt: {
      type: Schema.Types.Date,
      required: true,
      index: true,
    },
    endAt: {
      type: Schema.Types.Date,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      select: false,
    },
    createdAt: {
      type: Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index(
  { title: 'text', description: 'text' },
  { weights: { title: 3, description: 1 }, background: false },
);
schema.index({ _id: 1 });
schema.index({ startAt: 1 });
schema.index({ activityUrl: 1 });

export const ActivityModel = model<Activity>(DOCUMENT_NAME, schema, COLLECTION_NAME);
