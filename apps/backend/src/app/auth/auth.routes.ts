import { Router } from 'express';
import expressPromiseRouter from 'express-promise-router';
import { checkSchema } from 'express-validator';
import { validateBody } from '../middlewares/validator.body';
import { authController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.schemas';

export const authRouter = async (): Promise<Router> => {
  const router = expressPromiseRouter();
  const controller = await authController();
  router.post(
    '/register',
    validateBody(checkSchema(registerSchema)),
    controller.register
  );
  router.post(
    '/login',
    validateBody(checkSchema(loginSchema)),
    controller.login
  );

  return router;
};
