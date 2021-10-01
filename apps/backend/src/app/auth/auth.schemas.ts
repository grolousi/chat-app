import { Schema } from 'express-validator';

export const loginSchema: Schema = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'must be an email',
    },
    exists: {
      errorMessage: 'must have an email',
    },
  },
  password: {
    in: ['body'],
    exists: {
      errorMessage: 'must have an password',
    },
  },
};

export const registerSchema: Schema = {
  email: {
    in: ['body'],
    isEmail: {
      errorMessage: 'must be an email',
    },
    exists: {
      errorMessage: 'must have an email',
    },
  },
  password: {
    in: ['body'],
    isLength: {
      errorMessage: 'Password should be at least 7 chars long',
      options: { min: 7 },
    },
    exists: {
      errorMessage: 'must have an password',
    },
  },
};
