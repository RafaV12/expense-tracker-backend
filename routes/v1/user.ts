import express, { Router } from 'express';
import auth from '../../middlewares/auth';
import { createTx, getAllTxFromMonth, getMonthBalances, deleteTx } from '../../controllers/user';

const router: Router = express.Router();

router.post('/create-tx', auth, createTx);
router.get('/get-transactions/:month', auth, getAllTxFromMonth);
router.get('/get-balances/', auth, getMonthBalances);
router.delete('/transaction/:txId', auth, deleteTx);

export default router;
