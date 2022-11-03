"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_1 = require("../../controllers/user");
const router = express_1.default.Router();
router.post('/create-tx', auth_1.default, user_1.createTx);
router.get('/get-transactions/:month', auth_1.default, user_1.getAllTxFromMonth);
router.get('/get-balances/', auth_1.default, user_1.getMonthBalances);
router.delete('/transaction/:txId', auth_1.default, user_1.deleteTx);
router.patch('/transaction/:txId', auth_1.default, user_1.updateTx);
exports.default = router;
