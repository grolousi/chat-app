import { Request, Response } from 'express';
import { badRequest, internal, unauthorized } from 'boom';
import { errorLogger } from '../../logger';
import { authService } from './auth.service';
import { UserType } from '../types/user.types';
import { hash } from 'bcrypt';
import { createToken, validatePassword } from '../utils/jwt';

interface AuthControllerReturnType {
  register: (req: Request, res: Response) => Promise<Response>;
  login: (req: Request, res: Response) => Promise<Response>;
}

const userPresenter = (user: UserType): UserType => {
  return { ...user, password: undefined };
};

export const authController = async (): Promise<AuthControllerReturnType> => {
  const service = await authService();
  return {
    register: async (req, res) => {
      try {
        const existingUserByEmail = await service.getUserByEmail(
          req.body.email
        );

        if (existingUserByEmail) {
          const boomed = badRequest('auth/already-exist');
          return res
            .status(boomed.output.statusCode)
            .json(boomed.output.payload);
        }

        const user = req.body;
        const passwordHash = await hash(user.password, 12);
        const response = await service.createUser({
          ...user,
          password: passwordHash,
        });
        const fullUser = await service.getUserByEmail(req.body.email);

        return res
          .append(
            'Authorization',
            `Bearer ${createToken({ userId: response })}`
          )
          .status(201)
          .json(userPresenter(fullUser));
      } catch (error) {
        errorLogger(error);
        const boomed = internal();
        return res.status(boomed.output.statusCode);
      }
    },
    login: async (req, res) => {
      try {
        const user = await service.getUserByEmail(req.body.email);

        if (
          user &&
          (await validatePassword(req.body.password, user.password))
        ) {
          return res
            .append(
              'Authorization',
              `Bearer ${createToken({ userId: user._id })}`
            )
            .status(200)
            .json(userPresenter(user));
        }

        const boomed = unauthorized();
        return res.status(boomed.output.statusCode).json(boomed.output.payload);
      } catch (error) {
        errorLogger(error);
        const boomed = internal();
        return res.status(boomed.output.statusCode);
      }
    },
  };
};
