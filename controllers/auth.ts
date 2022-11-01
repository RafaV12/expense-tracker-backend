import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Payload } from '../types';
import User from '../models/User';
import catchAsync from '../utils/catchAsync';

export const registerUser = catchAsync(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Input validation (Can be improved!)
  let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  if (!username || !password) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Username and Password are required!' });
  }
  if (spChars.test(username)) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Special chars in Username are not allowed' });
  }
  if (username.length < 6 || password.length < 8) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: 'Username length: at least 6 chars. Password length: at least 8 chars' });
  }

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

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_LIFETIME as string });
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
    });
  }

  const payload: Payload = {
    userId: user.id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: process.env.JWT_LIFETIME as string });

  res.status(httpStatus.OK).json({ token });
});
