import { Response, NextFunction } from 'express';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { Payload, IRequest } from '../types';

export default function (req: IRequest, res: Response, next: NextFunction) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    res.status(httpStatus.UNAUTHORIZED).json({ msg: 'Token is not valid' });
  }
}
