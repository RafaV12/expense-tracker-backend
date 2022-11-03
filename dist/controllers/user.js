"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMonthBalances = exports.getAllTxFromMonth = exports.deleteTx = exports.updateTx = exports.createTx = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const User_1 = __importDefault(require("../models/User"));
const Tx_1 = __importDefault(require("../models/Tx"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.createTx = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, date, description, amount } = req.body;
    const { userId } = req;
    // Validation
    if (type !== 'Expense' || type !== 'Income') {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Unknown type of transaction' });
    }
    else if (description.length > 34) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Description is too long!' });
    }
    else if (amount > 1000000000) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Amount is too big!' });
    }
    const user = yield User_1.default.findOne({ id: userId });
    const tx = yield Tx_1.default.create({
        userId,
        type,
        date,
        description,
        amount,
    });
    // Add new tx to user's transactions array
    yield User_1.default.updateOne({ id: userId }, { transactions: [...user.transactions, tx._id] });
    const allTxs = yield Tx_1.default.find({ userId });
    return res.status(http_status_codes_1.default.OK).json(allTxs);
}));
exports.updateTx = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, type, date, description, amount } = req.body;
    // Validation
    if (type !== 'Expense' || type !== 'Income') {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Unknown type of transaction' });
    }
    else if (description.length > 34) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Description is too long!' });
    }
    else if (amount > 1000000000) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Amount is too big!' });
    }
    // If transaction exists, update it
    const tx = yield Tx_1.default.findOne({ _id });
    if (tx) {
        yield Tx_1.default.updateOne({ _id }, { $set: { type, date, description, amount } });
        return res.status(http_status_codes_1.default.OK).json({ tx });
    }
    return res.status(http_status_codes_1.default.NOT_FOUND).json({ message: 'Transaction does not exist!' });
}));
exports.deleteTx = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { txId } = req.params;
    const { userId } = req;
    // Delete transaction from user's transactions
    yield User_1.default.updateOne({ id: userId }, {
        $pullAll: {
            transactions: [txId],
        },
    });
    yield Tx_1.default.findByIdAndDelete({ _id: txId });
    const allTxs = yield Tx_1.default.find({ userId });
    return res.status(http_status_codes_1.default.OK).json(allTxs);
}));
exports.getAllTxFromMonth = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.params;
    const { userId } = req;
    // Find all transactions that match the id of the user and month from Tx's date (e.g: 'Sat Oct 29 2022').
    const allTxs = yield Tx_1.default.find({ userId, date: { $regex: `${month.slice(0, 3)}`, $options: 'i' } });
    if (allTxs.length > 0) {
        return res.status(http_status_codes_1.default.OK).json(allTxs);
    }
    return res.status(http_status_codes_1.default.OK).json({ msg: 'No transactios yet!' });
}));
exports.getMonthBalances = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Months in the database are stored on each Tx's date, sliced (e.g: 'Sat Oct 29 2022')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const { userId } = req;
    const allTxs = yield Tx_1.default.find({ userId });
    if (allTxs.length > 0) {
        let allBalances = [];
        // Loop through all transactions to filter transactions by month,
        // then get all the transactions amounts of said month.
        // Finally, sum all the months' amounts and push them to 'allBalances'
        for (let i = 0; i < months.length; i++) {
            let monthAmounts = allTxs.filter((tx) => tx.date.includes(months[i])).map((tx) => tx.amount);
            const sumOfMonthAmounts = monthAmounts.reduce((partialSum, a) => partialSum + a, 0);
            allBalances.push(sumOfMonthAmounts);
        }
        return res.status(http_status_codes_1.default.OK).json(allBalances);
    }
    return res.status(http_status_codes_1.default.OK).json([]);
}));
