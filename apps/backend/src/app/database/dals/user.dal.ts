import { Db, InsertOneResult, UpdateResult, ObjectId } from 'mongodb';
import { UserType } from '../../types/user.types';
import { dbConnector } from '../db.connector';

const COLLECTION = 'users';

interface UserDalReturnType {
  getUserByEmail: (email: string) => Promise<UserType>;
  getUserById: (id: string) => Promise<UserType>;
  createUser: (user: UserType) => Promise<InsertOneResult<UserType>>;
  updatePassword: (userId: string, password: string) => Promise<UpdateResult>;
}

export const userDal = async (): Promise<UserDalReturnType> => {
  const db: Db = await dbConnector.getDb(COLLECTION);
  const collection = db.collection(COLLECTION);

  return {
    getUserByEmail: async (email) => {
      return collection.findOne<UserType>({
        email,
      });
    },
    getUserById: async (id) => {
      return collection.findOne<UserType>({ _id: new ObjectId(id) });
    },
    createUser: async (user) => {
      return collection.insertOne({ ...user, _id: new ObjectId(user._id) });
    },

    updatePassword: async (userId, password) => {
      return collection.updateOne(
        { _id: new ObjectId(userId) },
        { $set: { password } }
      );
    },
  };
};
