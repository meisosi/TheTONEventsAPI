import { Schema, model, Types } from 'mongoose';
import User from './User';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore {
  _id: Types.ObjectId;
  owner: User;
  name: string,
  description: string,
  members?: User[];
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Keystore>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    description: {
      type: Schema.Types.String,
      required: true,
      trim: true,
    },
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'User',
        }
      ],
      required: false,
      select: false,
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

schema.index({ client: 1 });
schema.index({ client: 1, primaryKey: 1, status: 1 });
schema.index({ client: 1, primaryKey: 1, secondaryKey: 1 });

export const KeystoreModel = model<Keystore>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME,
);
