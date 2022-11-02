import { Response } from 'express';
import { IRequest } from '../types';
import httpStatus from 'http-status-codes';

import User from '../models/User';
import Tx from '../models/Tx';
import catchAsync from '../utils/catchAsync';

import { Transaction } from '../types';

export const createTx = catchAsync(async (req: IRequest, res: Response) => {
  const { type, date, description, amount } = req.body;
  const { userId } = req;

  const user = await User.findOne({ id: userId });

  const tx = await Tx.create({
    userId,
    type,
    date,
    description,
    amount,
  });

  // Add new tx to user's transactions array
  await User.updateOne({ id: userId }, { transactions: [...user!.transactions, tx._id] });

  const allTxs = await Tx.find({ userId });

  return res.status(httpStatus.OK).json(allTxs);
});

export const updateTx = catchAsync(async (req: IRequest, res: Response) => {
  const { _id, type, date, description, amount } = req.body;

  // If transaction exists, update it
  const tx = await Tx.findOne({ _id });
  if (tx) {
    await Tx.updateOne({ _id }, { $set: { type, date, description, amount } });

    return res.status(httpStatus.OK).json({ tx });
  }

  return res.status(httpStatus.NOT_FOUND).json({ message: 'Transaction does not exist!' });
});

export const deleteTx = catchAsync(async (req: IRequest, res: Response) => {
  const { txId } = req.params;
  const { userId } = req;

  // Delete transaction from user's transactions
  await User.updateOne(
    { id: userId },
    {
      $pullAll: {
        transactions: [txId],
      },
    }
  );

  await Tx.findByIdAndDelete({ _id: txId });

  const allTxs = await Tx.find({ userId });

  return res.status(httpStatus.OK).json(allTxs);
});

export const getAllTxFromMonth = catchAsync(async (req: IRequest, res: Response) => {
  const { month } = req.params;
  const { userId } = req;

  // Find all transactions that match the id of the user and month from Tx's date (e.g: 'Sat Oct 29 2022').
  const allTxs = await Tx.find({ userId, date: { $regex: `${month.slice(0, 3)}`, $options: 'i' } });

  if (allTxs.length > 0) {
    return res.status(httpStatus.OK).json(allTxs);
  }
  return res.status(httpStatus.OK).json({ msg: 'No transactios yet!' });
});

export const getMonthBalances = catchAsync(async (req: IRequest, res: Response) => {
  // Months in the database are stored on each Tx's date, sliced (e.g: 'Sat Oct 29 2022')
  const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const { userId } = req;

  const allTxs = await Tx.find({ userId });

  if (allTxs.length > 0) {
    let allBalances: number[] = [];

    // Loop through all transactions to filter transactions by month,
    // then get all the transactions amounts of said month.
    // Finally, sum all the months' amounts and push them to 'allBalances'
    for (let i = 0; i < months.length; i++) {
      let monthAmounts: Transaction['amount'][] = allTxs.filter((tx) => tx.date.includes(months[i])).map((tx) => tx.amount);
      const sumOfMonthAmounts = monthAmounts.reduce((partialSum, a) => partialSum + a, 0);
      allBalances.push(sumOfMonthAmounts);
    }

    return res.status(httpStatus.OK).json(allBalances);
  }
  return res.status(httpStatus.OK).json([]);
});
