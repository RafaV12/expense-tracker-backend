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
exports.loginUser = exports.registerUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
exports.registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Input validation (Can be improved!)
    let spChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!username || !password) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Username and Password are required!' });
    }
    if (spChars.test(username)) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Special chars in Username are not allowed' });
    }
    if (username.length < 6 || password.length < 8) {
        return res.status(http_status_codes_1.default.BAD_REQUEST).json({ message: 'Username length: at least 6 chars. Password length: at least 8 chars' });
    }
    const userExist = yield User_1.default.findOne({ username: username.toLowerCase() });
    if (!userExist) {
        const saltRounds = yield bcrypt_1.default.genSalt(10);
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        const newUser = {
            username: username.toLowerCase(),
            hashedPassword,
        };
        const user = yield User_1.default.create(newUser);
        const payload = {
            userId: user.id,
        };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
        return res.status(http_status_codes_1.default.OK).json({ token });
    }
    return res.status(http_status_codes_1.default.CONFLICT).json({
        message: 'Oops! Username already exists!',
    });
}));
exports.loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const user = yield User_1.default.findOne({ username: username.toLowerCase() });
    if (!user) {
        return res.status(http_status_codes_1.default.NOT_FOUND).json({
            message: 'Oops! Username or password is wrong!',
        });
    }
    const isPasswordCorrect = yield bcrypt_1.default.compare(password, user.hashedPassword);
    if (!isPasswordCorrect) {
        return res.status(http_status_codes_1.default.NOT_FOUND).json({
            message: 'Oops! Username or password is wrong!',
        });
    }
    const payload = {
        userId: user.id,
    };
    const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME });
    res.status(http_status_codes_1.default.OK).json({ token });
}));
