import { model, Schema, Types } from 'mongoose';
import Role from './Role';
import Activity from './Activity';
import Project from './Project';
import { Social } from '../../types/social';


export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User {
  _id: Types.ObjectId;
  username?: string;
  firstname?: string;
  profilePicUrl?: string;
  telegram?: number;
  ton_wallet?: string;
  social_media?: Social[];
  projects?: Project[];
  activities?: Activity[];
  roles: Role[];
  verified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<User>(
  {
    username: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    firstname: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
      selected: false,
    },
    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    telegram: {
      type: Schema.Types.String,
      unique: true,
      trim: true,
      select: false,
    },
    social_media: {
      type: [
        {
          social_media: {
            type: Schema.Types.String,
            required: true,
          },
          url: {
            type: Schema.Types.String,
            required: true,
            trim: true,
          },
        },
      ],
      required: false,
      select: false,
    },
    projects: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Project',
        },
      ],
      required: false,
      select: false,
    },
    activities: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Activity',
        },
      ],
      required: false,
      select: false,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Role',
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

schema.index({ _id: 1, status: 1 });
schema.index({ email: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
