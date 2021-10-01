import { userDal } from '../database/dals/user.dal';
import { UserType } from '../types/user.types';

interface AuthServiceReturnType {
  getUserByEmail: (email: string) => Promise<UserType>;
  createUser: (user: UserType) => Promise<string>;
  //updatePassword: (userId: string, password: string) => Promise<UpdateResult>;
}

export const authService = async (): Promise<AuthServiceReturnType> => {
  const uDal = await userDal();

  return {
    getUserByEmail: uDal.getUserByEmail,
    createUser: async (user) => {
      const creationResult = await uDal.createUser(user);
      return creationResult.insertedId.toString();
    },
  };
};
