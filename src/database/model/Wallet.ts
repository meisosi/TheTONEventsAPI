import { model, Schema, Types } from 'mongoose';
import User from './User';


export const DOCUMENT_NAME = 'Wallet';
export const COLLECTION_NAME = 'wallets';

export default interface Wallet {
  _id: Types.ObjectId;
  userLink?: User;
  address?: string;
  provider?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Wallet>(
  {
    userLink: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    address: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },
    provider: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
      selected: false,
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

export const WalletModel = model<Wallet>(DOCUMENT_NAME, schema, COLLECTION_NAME);
