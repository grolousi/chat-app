import { UserTokenType } from '../types/user.types';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

export const tokenSecret = process.env.TOKEN_SECRET || 'some-secret-key';

export const createToken = (tokenArg: UserTokenType): string => {
  return sign(tokenArg, tokenSecret, { expiresIn: '30d' });
};

export const validatePassword = (
  textPassword,
  hashedPassword
): Promise<boolean> => {
  return compare(textPassword, hashedPassword);
};
