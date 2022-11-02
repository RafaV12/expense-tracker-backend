import express, { Router } from 'express';
import auth from '../../middlewares/auth';
import { createTx, updateTx, deleteTx, getAllTxFromMonth, getMonthBalances } from '../../controllers/user';

const router: Router = express.Router();

router.post('/create-tx', auth, createTx);
router.get('/get-transactions/:month', auth, getAllTxFromMonth);
router.get('/get-balances/', auth, getMonthBalances);
router.delete('/transaction/:txId', auth, deleteTx);
router.put('/transaction/:txId', auth, updateTx);

export default router;
