import { Request } from 'express';

export type Payload = {
  userId: string;
  iat?: number;
  exp?: number;
};

export interface IRequest extends Request {
  userId?: string;
}

export type Transaction = {
  _id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
};

