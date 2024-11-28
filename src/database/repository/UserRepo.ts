import User, { UserModel } from '../model/User';
import { RoleModel } from '../model/Role';
import { InternalError } from '../../core/ApiError';
import { Types } from 'mongoose';
import KeystoreRepo from './KeystoreRepo';
import Keystore from '../model/Keystore';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id });
  return user !== null && user !== undefined;
}

async function findPrivateProfileById(
  id: Types.ObjectId,
): Promise<User | null> {
  return UserModel.findOne({ _id: id })
    .select('+ton_wallet +activities')
    .populate({
      path: 'roles',
      select: { code: 1 },
    })
    .lean<User>()
    .exec();
}

// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id })
    .select('+roles')
    .populate({
      path: 'roles',
    })
    .lean()
    .exec();
}

async function findByTelegram(id: number): Promise<User | null> {
  return UserModel.findOne({ telegram: id })
    .select('+roles')
    .populate({
      path: 'roles',
    })
    .lean()
    .exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id }).lean().exec();
}

async function create(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
  roleCode: string,
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  const role = await RoleModel.findOne({ code: roleCode })
    .select('+code')
    .lean()
    .exec();
  if (!role) throw new InternalError('Role must be defined');

  user.roles = [role];
  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey,
  );
  return {
    user: { ...createdUser.toObject(), roles: user.roles },
    keystore: keystore,
  };
}

async function update(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
): Promise<{ user: User; keystore: Keystore }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey,
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
  user.updatedAt = new Date();
  return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
}

export default {
  exists,
  findPrivateProfileById,
  findById,
  findByTelegram,
  findPublicProfileById,
  create,
  update,
  updateInfo,
};
