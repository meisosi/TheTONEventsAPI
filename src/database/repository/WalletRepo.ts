import User from '../model/User';
import Wallet, { WalletModel } from '../model/Wallet';
import { Types } from 'mongoose';

async function exists(id: Types.ObjectId): Promise<boolean> {
  const wallet = await WalletModel.exists({ _id: id });
  return wallet !== null && wallet !== undefined;
}

// contains critical information of the Wallet
async function findById(id: Types.ObjectId): Promise<Wallet | null> {
  return WalletModel.findOne({ _id: id })
    .select('+roles')
    .populate({
      path: 'roles',
    })
    .lean()
    .exec();
}

async function findByAddress(address: string): Promise<Wallet | null> {
  return WalletModel.findOne({ address: address })
    .select('+provider')
    .lean()
    .exec();
}

async function findByUserId(id: Types.ObjectId): Promise<Wallet | null> {
  return WalletModel.findOne({ _id: id })
    .select('+provider')
    .lean()
    .exec();
}

async function create(
  Wallet: Wallet,
  User: User,
): Promise<Wallet> {
  const now = new Date();
  Wallet.createdAt = Wallet.updatedAt = now;
  Wallet.userLink = User;
  const createdWallet = await WalletModel.create(Wallet);

  return createdWallet.toObject();
}

async function updateInfo(Wallet: Wallet): Promise<any> {
  Wallet.updatedAt = new Date();
  return WalletModel.updateOne({ _id: Wallet._id }, { $set: { ...Wallet } })
    .lean()
    .exec();
}

export default {
  exists,
  findById,
  findByUserId,
  findByAddress,
  create,
  updateInfo,
};
