"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
function default_1(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(http_status_codes_1.default.UNAUTHORIZED).json({ msg: 'No token, authorization denied' });
    }
    // Verify token
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (err) {
        res.status(http_status_codes_1.default.UNAUTHORIZED).json({ msg: 'Token is not valid' });
    }
}
exports.default = default_1;
