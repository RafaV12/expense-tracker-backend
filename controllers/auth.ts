import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from '../config/config';
import { Payload } from '../types';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const userExist = await User.findOne({ username: username.toLowerCase() });

  if (!userExist) {
    const saltRounds = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      username: username.toLowerCase(),
      hashedPassword,
    };

    const user = await User.create(newUser);

    const payload: Payload = {
      userId: user.id,
    };

    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_LIFETIME });

    return res.status(httpStatus.OK).json({ token });
  }

  return res.status(httpStatus.CONFLICT).json({
    message: 'Oops! Username already exists!',
  });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'Oops! Username or password is wrong!',
    });
  }

  const isPasswordCorrect: boolean = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordCorrect) {
    return res.status(httpStatus.NOT_FOUND).json({
      message: 'Oops! Username or password is wrong!',
      code: 404,
      field: 'username or password',
    });
  }

  const payload: Payload = {
    userId: user.id,
  };

  const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: config.JWT_LIFETIME });

  res.status(httpStatus.OK).json({ token });
});
